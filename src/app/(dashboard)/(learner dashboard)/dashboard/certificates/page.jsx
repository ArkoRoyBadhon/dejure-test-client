"use client";

import { Award, Download, Eye, AlertCircle, CheckCircle } from "lucide-react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useGetEnrollmentsByUserQuery } from "@/redux/features/enroll/enroll.api";
import Loader from "@/components/shared/Loader";
import {
  useGenerateCertificateMutation,
  useGenerateCertificateBase64Mutation,
  useCheckCertificateExistsMutation,
  useDownloadCertificateFileMutation,
} from "@/redux/features/certificate/certificate.api";
import {
  base64ToBlob,
  downloadBlob,
  openBlobInNewTab,
} from "@/Utils/certificateUtils";

export default function CertificationPage() {
  const [isClient, setIsClient] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCertificates, setGeneratedCertificates] = useState(new Set());
  const [isCheckingExisting, setIsCheckingExisting] = useState(false);
  const [hasCheckedExisting, setHasCheckedExisting] = useState(false); // Add this flag

  const user = useSelector((state) => state.auth?.user);
  const learnerId = user?._id;
  const learnerName = user?.fullName || user?.name || "Student";

  const {
    data: enrollments,
    isLoading,
    isError,
  } = useGetEnrollmentsByUserQuery(learnerId, {
    skip: !learnerId,
  });

  const [generateCertificate] = useGenerateCertificateMutation();
  const [generateCertificateBase64] = useGenerateCertificateBase64Mutation();
  const [checkCertificateExists] = useCheckCertificateExistsMutation();
  const [downloadCertificateFile] = useDownloadCertificateFileMutation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Memoize certificates to prevent infinite re-renders
  const certificates = useMemo(() => {
    if (!Array.isArray(enrollments) || enrollments.length === 0) return [];

    return enrollments
      .filter(
        (enrollment) =>
          enrollment?.course &&
          enrollment?.payment?.isPaid &&
          enrollment?.status === "completed"
      )
      .map((enrollment, idx) => ({
        id: `CERT-${new Date().getFullYear()}-${String(idx + 1).padStart(
          3,
          "0"
        )}`,
        courseName: enrollment.course.title,
        studentName: learnerName,
        completionDate:
          enrollment.completedAt ||
          enrollment.updatedAt ||
          new Date().toISOString(),
        instructor: enrollment.course?.mentor?.fullName || "Course Instructor",
        grade: enrollment.grade || "N/A",
        description:
          enrollment.course?.description?.slice(0, 120) ||
          "For successfully completing the course.",
      }));
  }, [enrollments, learnerName]); // Add dependencies

  // Check for existing certificates only once when certificates are loaded
  useEffect(() => {
    const checkExistingCertificates = async () => {
      // Prevent infinite checks by using a flag
      if (!certificates || certificates.length === 0 || hasCheckedExisting)
        return;

      setIsCheckingExisting(true);
      setHasCheckedExisting(true); // Set flag to prevent future checks
      const existingCertIds = new Set();

      try {
        for (const cert of certificates) {
          const certificateData = {
            studentName: cert.studentName,
            courseName: cert.courseName,
            completionDate: cert.completionDate,
            instructor: cert.instructor,
            description: cert.description,
            certificateId: cert.id,
          };

          const existsResult = await checkCertificateExists(
            certificateData
          ).unwrap();
          if (existsResult.success && existsResult.data.exists) {
            existingCertIds.add(cert.id);
          }
        }

        if (existingCertIds.size > 0) {
          setGeneratedCertificates(existingCertIds);
        }
      } catch (error) {
      } finally {
        setIsCheckingExisting(false);
      }
    };

    checkExistingCertificates();
  }, [certificates, hasCheckedExisting, checkCertificateExists]); // Add dependencies

  // Reset the check flag when enrollments change (user logs in/out)
  useEffect(() => {
    setHasCheckedExisting(false);
  }, [enrollments]);

  // Handle certificate generation (first time) - unchanged
  const handleGenerate = async (certificate) => {
    try {
      setIsGenerating(true);

      toast.loading("Generating certificate...", {
        id: "cert-generate",
        description: "Please wait while we create your certificate",
      });

      const certificateData = {
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        completionDate: certificate.completionDate,
        instructor: certificate.instructor,
        description: certificate.description,
        certificateId: certificate.id,
      };

      try {
        const existsResult = await checkCertificateExists(
          certificateData
        ).unwrap();

        if (existsResult.success && existsResult.data.exists) {
          setGeneratedCertificates(
            (prev) => new Set([...prev, certificate.id])
          );
          toast.success("Certificate found!", {
            id: "cert-generate",
            icon: <CheckCircle className="text-green-500" />,
            description: "Your certificate is ready for download and viewing",
          });
          return;
        }
      } catch (checkError) {}

      const result = await generateCertificateBase64(certificateData).unwrap();

      if (result.success) {
        setGeneratedCertificates((prev) => new Set([...prev, certificate.id]));
        toast.success("Certificate generated successfully!", {
          id: "cert-generate",
          icon: <CheckCircle className="text-green-500" />,
          description: "Your certificate is now ready for download and viewing",
        });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      let errorMessage = "Failed to generate certificate. Please try again.";

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      toast.error("Certificate generation failed", {
        id: "cert-generate",
        icon: <AlertCircle className="text-red-500" />,
        description: errorMessage,
        action: {
          label: "Retry",
          onClick: () => handleGenerate(certificate),
        },
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle certificate download - unchanged
  const handleDownload = async (certificate) => {
    try {
      setIsGenerating(true);
      toast.loading("Checking for existing certificate...", {
        id: "cert-download",
        description: "Please wait while we check for your certificate",
      });

      const certificateData = {
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        completionDate: certificate.completionDate,
        instructor: certificate.instructor,
        description: certificate.description,
        certificateId: certificate.id,
      };

      try {
        const existsResult = await checkCertificateExists(
          certificateData
        ).unwrap();

        if (existsResult.success && existsResult.data.exists) {
          toast.loading("Downloading existing certificate...", {
            id: "cert-download",
            description: "Found your certificate, downloading now",
          });

          const downloadResult = await downloadCertificateFile(
            certificateData
          ).unwrap();

          if (downloadResult instanceof Blob) {
            downloadBlob(downloadResult, existsResult.data.filename);
            toast.success("Certificate downloaded successfully!", {
              id: "cert-download",
              icon: <CheckCircle className="text-green-500" />,
              description: `Your ${certificate.courseName} certificate is ready`,
            });
            return;
          }
        }
      } catch (checkError) {}

      toast.loading("Generating certificate...", {
        id: "cert-download",
        description: "Please wait while we create your certificate",
      });

      const blob = await generateCertificate(certificateData).unwrap();
      const filename = `${certificate.courseName.replace(
        /\s+/g,
        "_"
      )}_Certificate.pdf`;
      downloadBlob(blob, filename);

      toast.success("Certificate generated and downloaded successfully!", {
        id: "cert-download",
        icon: <CheckCircle className="text-green-500" />,
        description: `Your ${certificate.courseName} certificate is ready`,
      });
    } catch (error) {
      let errorMessage = "Failed to generate certificate. Please try again.";

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      toast.error("Certificate generation failed", {
        id: "cert-download",
        icon: <AlertCircle className="text-red-500" />,
        description: errorMessage,
        action: {
          label: "Retry",
          onClick: () => handleDownload(certificate),
        },
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle certificate preview - unchanged
  const handleView = async (certificate) => {
    try {
      setIsGenerating(true);
      toast.loading("Checking for existing certificate...", {
        id: "cert-preview",
        description: "Please wait while we check for your certificate",
      });

      const certificateData = {
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        completionDate: certificate.completionDate,
        instructor: certificate.instructor,
        description: certificate.description,
        certificateId: certificate.id,
      };

      try {
        const existsResult = await checkCertificateExists(
          certificateData
        ).unwrap();

        if (existsResult.success && existsResult.data.exists) {
          toast.loading("Loading existing certificate...", {
            id: "cert-preview",
            description: "Found your certificate, opening now",
          });

          const downloadResult = await downloadCertificateFile(
            certificateData
          ).unwrap();

          if (downloadResult instanceof Blob) {
            openBlobInNewTab(downloadResult);
            toast.success("Certificate preview opened!", {
              id: "cert-preview",
              icon: <CheckCircle className="text-green-500" />,
              description: `Your ${certificate.courseName} certificate is now open`,
            });
            return;
          }
        }
      } catch (checkError) {}

      toast.loading("Generating certificate preview...", {
        id: "cert-preview",
        description: "Please wait while we create your certificate",
      });

      const result = await generateCertificateBase64(certificateData).unwrap();

      if (result.success) {
        if (result.data.pdf) {
          const blob = base64ToBlob(result.data.pdf);
          openBlobInNewTab(blob);

          const message = result.data.cached
            ? "Certificate retrieved from cache and opened!"
            : "Certificate generated and opened successfully!";

          toast.success(message, {
            id: "cert-preview",
            icon: <CheckCircle className="text-green-500" />,
            description: "Your certificate is now open in a new tab",
          });
        } else if (result.data.html && result.data.fallback) {
          const htmlBlob = base64ToBlob(result.data.html, "text/html");
          openBlobInNewTab(htmlBlob);

          toast.warning("Certificate preview opened as HTML", {
            id: "cert-preview",
            icon: <AlertCircle className="text-yellow-500" />,
            description:
              "PDF generation temporarily unavailable. HTML version opened.",
          });
        } else {
          throw new Error("Invalid response from server");
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      let errorMessage = "Failed to generate certificate. Please try again.";

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      toast.error("Certificate preview failed", {
        id: "cert-preview",
        icon: <AlertCircle className="text-red-500" />,
        description: errorMessage,
        action: {
          label: "Retry",
          onClick: () => handleView(certificate),
        },
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border shadow-md">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-200 opacity-70" />
        <div className="relative flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/70 rounded-full shadow">
              <Award className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#141B34]">
                Certificates
              </h1>
              <p className="text-sm md:text-base text-gray-600 font-medium">
                View, download & showcase your achievements
              </p>
            </div>
          </div>
          <div className="hidden md:block">
            <span className="px-4 py-1 rounded-full bg-amber-500 text-white text-sm font-semibold shadow">
              🎓 Achievements
            </span>
          </div>
        </div>
      </div>

      {/* Certificates List */}
      <div className="p-4">
        {isLoading ? (
          <div className="text-center text-gray-500">
            <Loader text="Loading certificates..." size="sm" />
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">
              No certificates earned yet
            </p>
            <p className="text-gray-500 text-sm">
              Complete your enrolled courses to earn certificates
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {cert.courseName}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        ID: {cert.id}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Completed
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <span className="font-medium mr-2">Issued:</span>
                      {new Date(cert.completionDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                    {!generatedCertificates.has(cert.id) ? (
                      <button
                        className="flex items-center px-6 py-2 bg-main text-white rounded-lg hover:bg-main/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mx-auto"
                        onClick={() => handleGenerate(cert)}
                        disabled={isGenerating || isCheckingExisting}
                      >
                        <Award className="w-4 h-4 mr-2" />
                        {isGenerating
                          ? "Generating..."
                          : isCheckingExisting
                          ? "Checking..."
                          : "Generate Certificate"}
                      </button>
                    ) : (
                      <>
                        <button
                          className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                          onClick={() => handleDownload(cert)}
                          disabled={isGenerating}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {isGenerating ? "Generating..." : "Download"}
                        </button>

                        <button
                          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                          onClick={() => handleView(cert)}
                          disabled={isGenerating}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {isGenerating ? "<Loader />" : "View"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

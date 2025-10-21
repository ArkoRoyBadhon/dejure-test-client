"use client";
import { Upload, X, FileText, Loader2, Delete, Trash } from "lucide-react";
import React, { useState, useRef } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import {
  useBulkRegisterLearnersMutation,
  useGetAllLearnersQuery,
} from "@/redux/features/auth/learner.api";

const ExcelSheetExtracter = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [bulkRegisterLearners] = useBulkRegisterLearnersMutation();
  const { refetch } = useGetAllLearnersQuery();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Check file type
    if (
      ![
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ].includes(selectedFile.type)
    ) {
      toast.error("Please upload a valid Excel file (.xlsx or .xls)");
      return;
    }

    setFile(selectedFile);
    parseExcelFile(selectedFile);
  };

  const parseExcelFile = (file) => {
    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // ✅ Validate required fields (email is optional)
        const requiredFields = ["fullName", "phone", "shippingAddress"];
        const missingFields = requiredFields.filter(
          (field) => !jsonData[0]?.hasOwnProperty(field)
        );

        if (jsonData.length === 0 || missingFields.length > 0) {
          toast.error(
            `Excel file must contain these columns: ${requiredFields.join(
              ", "
            )}. Missing: ${missingFields.join(", ")}`
          );
          setFile(null);
          setIsLoading(false);
          return;
        }

        // ✅ Normalize columns so preview always shows consistent headers
        const expectedColumns = [
          "fullName",
          "email",
          "phone",
          "role",
          "shippingAddress",
        ];

        const normalizedData = jsonData.map((row) => {
          const normalizedRow = {};
          expectedColumns.forEach((col) => {
            normalizedRow[col] = row[col] || ""; // keep blank if missing
          });
          return normalizedRow;
        });

        setFullData(normalizedData);
        setPreviewData(normalizedData.slice(0, 5));
        setIsLoading(false);
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        toast.error("Error parsing Excel file");
        setFile(null);
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      toast.error("Error reading file");
      setIsLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleUpload = async () => {
    if (!file || fullData.length === 0) {
      toast.error("Please select a valid Excel file first");
      return;
    }

    setIsUploading(true);
    try {
      // Prepare the data according to your schema requirements
      const learnersData = fullData.map((student) => ({
        fullName: student.fullName,
        email: student.email,
        phone: student.phone.toString(),
        shippingAddress: student.shippingAddress,
        // password: student.password.toString() || undefined, // Let server generate if not provided
        // Include other optional fields
        secondaryPhone: student.secondaryPhone || undefined,
        secondaryEmail: student.secondaryEmail || undefined,
        currentOccupation: student.currentOccupation || undefined,
        interestedSector: student.interestedSector || undefined,
        gender: student.gender || undefined,
        age: student.age || undefined,
        educationBackground: student.educationBackground || undefined,
        educationalInstitution: student.educationalInstitution || undefined,
        address: student.address || undefined,
      }));

      // Filter out any invalid entries
      const validLearners = learnersData.filter(
        (learner) =>
          learner.fullName &&
          // learner.email &&
          learner.phone &&
          learner.shippingAddress
      );

      if (validLearners.length === 0) {
        toast.error("No valid learner data to upload");
        setIsUploading(false);
        return;
      }

      // Send bulk request
      const response = await bulkRegisterLearners({
        learners: validLearners,
      }).unwrap();

      // Show results
      if (response.failed > 0) {
        toast.warning(`Upload completed and ${response.failed} failures`);
      } else {
        toast.success(`Successfully uploaded ${response.successful} students`);
      }

      refetch();
      onClose();
    } catch (error) {
      console.error("Error during bulk upload:", error);
      toast.error(error.data?.message || "Error during bulk upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewData([]);
    setFullData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const exportAsJson = () => {
    if (fullData.length === 0) {
      toast.error("No data to export");
      return;
    }

    const jsonString = JSON.stringify(fullData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file
      ? `${file.name.split(".")[0]}.json`
      : "students_data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-[800px] max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Import Students from Excel</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Excel File
          </label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-md border border-dashed border-gray-300 flex flex-col items-center justify-center w-full">
              <Upload className="w-8 h-8 text-gray-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">
                {file ? file.name : "Click to select Excel file"}
              </span>
              <span className="text-xs text-gray-500">
                .xlsx or .xls format
              </span>
              <input
                type="file"
                ref={fileInputRef}
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {file && (
              <Button
                type="ghost"
                onClick={handleRemoveFile}
                className="text-white bg-red hover:bg-red/90 flex justify-center items-center flex-col h-full"
              >
                <Trash className="w-8 h-8" />
                Remove
              </Button>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        )}

        {previewData.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700">
                Data Preview (first 5 rows)
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={exportAsJson}
                disabled={isUploading}
              >
                <FileText className="w-4 h-4 mr-2" />
                Export as JSON
              </Button>
            </div>
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(previewData[0]).map((key) => (
                      <th
                        key={key}
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((value, j) => (
                        <td
                          key={j}
                          className="px-3 py-2 whitespace-nowrap text-sm text-gray-500"
                        >
                          {value?.toString() || ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-sm text-gray-500">
              <p>Total rows: {fullData.length}</p>
              <p>
                Columns detected:{" "}
                {previewData.length > 0
                  ? Object.keys(previewData[0]).join(", ")
                  : "None"}
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || isLoading || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Students"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExcelSheetExtracter;

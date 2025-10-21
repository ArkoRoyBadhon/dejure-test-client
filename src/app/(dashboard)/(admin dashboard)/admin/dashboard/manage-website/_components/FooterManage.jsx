"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useGetAllFootersQuery } from "@/redux/features/WebManage/Footer.api";
import FooterDialog from "./FooterDialog";

import Loader from "@/components/shared/Loader";
// Main FooterManage component
export default function FooterManage() {
  const { data, isLoading, refetch } = useGetAllFootersQuery();
  const [open, setOpen] = useState(false);

  // If footer exists, use index[0]
  const footer = data?.[0];

  return (
    <div className="p-6">
      {/* Show footer data */}
      <div className="bg-white rounded shadow p-4">
        {isLoading ? (
          <Loader />
        ) : footer ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Logo Title:</strong> {footer.logoTitle}
              </div>
              <div>
                <strong>Download Title:</strong> {footer.downloadTitle}
              </div>
              <div>
                <strong>Playstore Link:</strong>
                <a
                  href={footer.playstoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 ml-2"
                >
                  {footer.playstoreLink}
                </a>
              </div>
              <div>
                <strong>Appstore Link:</strong>
                <a
                  href={footer.appstoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 ml-2"
                >
                  {footer.appstoreLink}
                </a>
              </div>
              <div>
                <strong>Social Title:</strong> {footer.socialTitle}
              </div>
              <div>
                <strong>Facebook:</strong>
                <a
                  href={footer.fbLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 ml-2"
                >
                  {footer.fbLink}
                </a>
              </div>
              <div>
                <strong>YouTube:</strong>
                <a
                  href={footer.ytLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 ml-2"
                >
                  {footer.ytLink}
                </a>
              </div>
              <div>
                <strong>Instagram:</strong>
                <a
                  href={footer.instaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 ml-2"
                >
                  {footer.instaLink}
                </a>
              </div>
              <div>
                <strong>LinkedIn:</strong>
                <a
                  href={footer.linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 ml-2"
                >
                  {footer.linkedinLink}
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Title:</strong> {footer.quickLink?.title}
                </div>
                <div>
                  <strong>Blog Title:</strong> {footer.quickLink?.blogTitle}
                </div>
                <div>
                  <strong>Blog Link:</strong> {footer.quickLink?.blogLink}
                </div>
                <div>
                  <strong>Privacy Title:</strong>{" "}
                  {footer.quickLink?.privacyTitle}
                </div>
                <div>
                  <strong>Privacy Link:</strong> {footer.quickLink?.privacyLink}
                </div>
                <div>
                  <strong>Terms Title:</strong> {footer.quickLink?.termsTitle}
                </div>
                <div>
                  <strong>Terms Link:</strong> {footer.quickLink?.termsLink}
                </div>
                <div>
                  <strong>Refund Title:</strong> {footer.quickLink?.refundTitle}
                </div>
                <div>
                  <strong>Refund Link:</strong> {footer.quickLink?.refundLink}
                </div>
                <div>
                  <strong>Contact Support Title:</strong>{" "}
                  {footer.quickLink?.contactSupportTitle}
                </div>
                <div>
                  <strong>Contact Support Link:</strong>{" "}
                  {footer.quickLink?.contactSupportLink}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">
                Contact Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Title:</strong> {footer.contactsInfo?.title}
                </div>
                <div>
                  <strong>Email:</strong> {footer.contactsInfo?.email}
                </div>
                <div>
                  <strong>Phone:</strong> {footer.contactsInfo?.phone}
                </div>
                <div>
                  <strong>Address:</strong> {footer.contactsInfo?.address}
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">
                Company Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Title:</strong> {footer.companyInfo?.title}
                </div>
                <div>
                  <strong>Trade License Title:</strong>{" "}
                  {footer.companyInfo?.tradeLicenseTitle}
                </div>
                <div>
                  <strong>Trade License:</strong>{" "}
                  {footer.companyInfo?.tradeLicense}
                </div>
                <div>
                  <strong>ETIN Title:</strong> {footer.companyInfo?.etinTitle}
                </div>
                <div>
                  <strong>ETIN Number:</strong> {footer.companyInfo?.etinNumber}
                </div>
              </div>
            </div>

            {/* Copyright Info */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">
                Copyright Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Title:</strong> {footer.copyRight?.title}
                </div>
                <div>
                  <strong>Title 1:</strong> {footer.copyRight?.title1}
                </div>
                <div>
                  <strong>Title 1 Link:</strong> {footer.copyRight?.title1Link}
                </div>
                <div>
                  <strong>Title 2:</strong> {footer.copyRight?.title2}
                </div>
                <div>
                  <strong>Title 2 Link:</strong> {footer.copyRight?.title2Link}
                </div>
                <div>
                  <strong>Title 3:</strong> {footer.copyRight?.title3}
                </div>
                <div>
                  <strong>Title 3 Link:</strong> {footer.copyRight?.title3Link}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>No Footer Data Found.</div>
        )}
      </div>

      <div className="flex items-center justify-center mt-6">
        <Button onClick={() => setOpen(true)}>
          {footer ? "Update Footer" : "Create Footer"}
        </Button>
      </div>

      {/* Footer Dialog */}
      <FooterDialog
        open={open}
        setOpen={setOpen}
        footer={footer}
        refetch={refetch}
      />
    </div>
  );
}

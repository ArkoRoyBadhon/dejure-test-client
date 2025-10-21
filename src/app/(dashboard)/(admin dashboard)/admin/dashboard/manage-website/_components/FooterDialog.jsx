"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  useCreateFooterMutation,
  useUpdateFooterMutation,
} from "@/redux/features/WebManage/Footer.api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
export default function FooterDialog({ open, setOpen, footer, refetch }) {
  const [createFooter] = useCreateFooterMutation();
  const [updateFooter] = useUpdateFooterMutation();

  const [form, setForm] = useState({
    logoTitle: "",
    downloadTitle: "",
    playstoreLink: "",
    appstoreLink: "",
    socialTitle: "",
    fbLink: "",
    ytLink: "",
    instaLink: "",
    linkedinLink: "",
    quickLink: {
      title: "",
      blogTitle: "",
      blogLink: "",
      privacyTitle: "",
      privacyLink: "",
      termsTitle: "",
      termsLink: "",
      refundTitle: "",
      refundLink: "",
      contactSupportTitle: "",
      contactSupportLink: "",
    },
    contactsInfo: {
      title: "",
      email: "",
      phone: "",
      address: "",
    },
    companyInfo: {
      title: "",
      tradeLicenseTitle: "",
      tradeLicense: "",
      etinTitle: "",
      etinNumber: "",
    },
    copyRight: {
      title: "",
      title1: "",
      title1Link: "",
      title2: "",
      title2Link: "",
      title3: "",
      title3Link: "",
    },
    logo: null,
  });

  // Populate form for update
  useEffect(() => {
    if (footer) setForm({ ...footer, logo: null });
  }, [footer]);

  // Handle input changes (supports nested fields)
  const handleChange = (e, parent) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, logo: files[0] }));
    } else if (parent) {
      setForm((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Create or update footer
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null && key !== "logo") {
        Object.entries(value).forEach(([k, v]) => {
          formData.append(`${key}.${k}`, v ?? "");
        });
      } else if (key === "logo" && value) {
        formData.append("image", value);
      } else if (key !== "logo") {
        formData.append(key, value ?? "");
      }
    });

    if (footer?._id) {
      await updateFooter({ id: footer._id, data: formData });
      toast.success("Footer updated successfully");
    } else {
      await createFooter(formData);
      toast.success("Footer created successfully");
    }
    setOpen(false);
    refetch();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto custom-dialog-width">
        <DialogHeader>
          <DialogTitle className="text-center">
            {footer ? "Update Footer Info" : "Create Footer"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* logo related */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Logo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleChange}
                name="logo"
                className="cursor-pointer"
              />
            </div>
            <div>
              <Label>Logo Title</Label>
              <Input
                name="logoTitle"
                value={form.logoTitle || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* App Download related */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Download Title</Label>
              <Input
                name="downloadTitle"
                value={form.downloadTitle || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Playstore Link</Label>
              <Input
                name="playstoreLink"
                value={form.playstoreLink || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Appstore Link</Label>
              <Input
                name="appstoreLink"
                value={form.appstoreLink || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Social Media Fields */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Social Title</Label>
              <Input
                name="socialTitle"
                value={form.socialTitle || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Facebook Link</Label>
              <Input
                name="fbLink"
                value={form.fbLink || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>YouTube Link</Label>
              <Input
                name="ytLink"
                value={form.ytLink || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Instagram Link</Label>
              <Input
                name="instaLink"
                value={form.instaLink || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>LinkedIn Link</Label>
              <Input
                name="linkedinLink"
                value={form.linkedinLink || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Quick Link Fields */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <div>
              <Label>Quick Link Title</Label>
              <Input
                name="title"
                value={form.quickLink?.title || ""}
                onChange={(e) => handleChange(e, "quickLink")}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Blog Title</Label>
                <Input
                  name="blogTitle"
                  value={form.quickLink?.blogTitle || ""}
                  onChange={(e) => handleChange(e, "quickLink")}
                />
              </div>
              <div>
                <Label>Blog Link</Label>
                <Input
                  name="blogLink"
                  value={form.quickLink?.blogLink || ""}
                  onChange={(e) => handleChange(e, "quickLink")}
                />
              </div>
              <div>
                <Label>Privacy Title</Label>
                <Input
                  name="privacyTitle"
                  value={form.quickLink?.privacyTitle || ""}
                  onChange={(e) => handleChange(e, "quickLink")}
                />
              </div>
              <div>
                <Label>Privacy Link</Label>
                <Input
                  name="privacyLink"
                  value={form.quickLink?.privacyLink || ""}
                  onChange={(e) => handleChange(e, "quickLink")}
                />
              </div>
              <div>
                <Label>Terms Title</Label>
                <Input
                  name="termsTitle"
                  value={form.quickLink?.termsTitle || ""}
                  onChange={(e) => handleChange(e, "quickLink")}
                />
              </div>
              <div>
                <Label>Terms Link</Label>
                <Input
                  name="termsLink"
                  value={form.quickLink?.termsLink || ""}
                  onChange={(e) => handleChange(e, "quickLink")}
                />
              </div>
              <div>
                <Label>Refund Title</Label>
                <Input
                  name="refundTitle"
                  value={form.quickLink?.refundTitle || ""}
                  onChange={(e) => handleChange(e, "quickLink")}
                />
              </div>
              <div>
                <Label>Refund Link</Label>
                <Input
                  name="refundLink"
                  value={form.quickLink?.refundLink || ""}
                  onChange={(e) => handleChange(e, "quickLink")}
                />
              </div>
              <div>
                <Label>Contact Support Title</Label>
                <Input
                  name="contactSupportTitle"
                  value={form.quickLink?.contactSupportTitle || ""}
                  onChange={(e) => handleChange(e, "quickLink")}
                />
              </div>
              <div>
                <Label>Contact Support Link</Label>
                <Input
                  name="contactSupportLink"
                  value={form.quickLink?.contactSupportLink || ""}
                  onChange={(e) => handleChange(e, "quickLink")}
                />
              </div>
            </div>
          </div>

          {/* Contacts Info */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label>Contacts Title</Label>
                <Input
                  name="title"
                  value={form.contactsInfo?.title || ""}
                  onChange={(e) => handleChange(e, "contactsInfo")}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  name="email"
                  value={form.contactsInfo?.email || ""}
                  onChange={(e) => handleChange(e, "contactsInfo")}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  name="phone"
                  value={form.contactsInfo?.phone || ""}
                  onChange={(e) => handleChange(e, "contactsInfo")}
                />
              </div>
            </div>
            <div>
              <Label>Address</Label>
              <Input
                name="address"
                value={form.contactsInfo?.address || ""}
                onChange={(e) => handleChange(e, "contactsInfo")}
              />
            </div>
          </div>

          {/* Company Info */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">Company Information</h3>
            <div>
              <Label>Company Title</Label>
              <Input
                name="title"
                value={form.companyInfo?.title || ""}
                onChange={(e) => handleChange(e, "companyInfo")}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Trade License Title</Label>
                <Input
                  name="tradeLicenseTitle"
                  value={form.companyInfo?.tradeLicenseTitle || ""}
                  onChange={(e) => handleChange(e, "companyInfo")}
                />
              </div>
              <div>
                <Label>Trade License</Label>
                <Input
                  name="tradeLicense"
                  value={form.companyInfo?.tradeLicense || ""}
                  onChange={(e) => handleChange(e, "companyInfo")}
                />
              </div>
              <div>
                <Label>ETIN Title</Label>
                <Input
                  name="etinTitle"
                  value={form.companyInfo?.etinTitle || ""}
                  onChange={(e) => handleChange(e, "companyInfo")}
                />
              </div>
              <div>
                <Label>ETIN Number</Label>
                <Input
                  name="etinNumber"
                  value={form.companyInfo?.etinNumber || ""}
                  onChange={(e) => handleChange(e, "companyInfo")}
                />
              </div>
            </div>
          </div>

          {/* CopyRight */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">
              Copyright Information
            </h3>
            <div>
              <Label>CopyRight Title</Label>
              <Input
                name="title"
                value={form.copyRight?.title || ""}
                onChange={(e) => handleChange(e, "copyRight")}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Title 1</Label>
                <Input
                  name="title1"
                  value={form.copyRight?.title1 || ""}
                  onChange={(e) => handleChange(e, "copyRight")}
                />
              </div>
              <div>
                <Label>Title 1 Link</Label>
                <Input
                  name="title1Link"
                  value={form.copyRight?.title1Link || ""}
                  onChange={(e) => handleChange(e, "copyRight")}
                />
              </div>
              <div>
                <Label>Title 2</Label>
                <Input
                  name="title2"
                  value={form.copyRight?.title2 || ""}
                  onChange={(e) => handleChange(e, "copyRight")}
                />
              </div>
              <div>
                <Label>Title 2 Link</Label>
                <Input
                  name="title2Link"
                  value={form.copyRight?.title2Link || ""}
                  onChange={(e) => handleChange(e, "copyRight")}
                />
              </div>
              <div>
                <Label>Title 3</Label>
                <Input
                  name="title3"
                  value={form.copyRight?.title3 || ""}
                  onChange={(e) => handleChange(e, "copyRight")}
                />
              </div>
              <div>
                <Label>Title 3 Link</Label>
                <Input
                  name="title3Link"
                  value={form.copyRight?.title3Link || ""}
                  onChange={(e) => handleChange(e, "copyRight")}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit">{footer ? "Update" : "Create"}</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, X, Check, ChevronsUpDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { baseUrl } from "@/redux/api/api";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const RepresentativeForm = ({
  formData,
  setFormData,
  leads,
  onSubmit,
  isLoading,
  editingRep,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setIsDropdownOpen(false);
    }
  }, [isModalOpen]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData((prev) => ({
        ...prev,
        profileDetails: {
          ...prev.profileDetails,
          profileImage: files[0] || null,
        },
      }));
    } else if (name === "fullName") {
      setFormData((prev) => ({
        ...prev,
        profileDetails: {
          ...prev.profileDetails,
          fullName: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleLeadSelection = (leadId) => {
    setFormData((prev) => {
      const isSelected = prev.assignedLeads.includes(leadId);
      return {
        ...prev,
        assignedLeads: isSelected
          ? prev.assignedLeads.filter((id) => id !== leadId)
          : [...prev.assignedLeads, leadId],
      };
    });
  };

  const removeLead = (leadId) => {
    setFormData((prev) => ({
      ...prev,
      assignedLeads: prev.assignedLeads.filter((id) => id !== leadId),
    }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Section */}
        <div className="md:col-span-2 flex items-center gap-4">
          <div className="relative">
            {formData.profileDetails.profileImage ? (
              <img
                src={
                  typeof formData.profileDetails.profileImage === "string"
                    ? `${baseUrl}/${formData.profileDetails.profileImage}`
                    : URL.createObjectURL(formData.profileDetails.profileImage)
                }
                alt="Profile preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
            ) : editingRep?.profileDetails?.profileImage ? (
              <img
                src={`${baseUrl}/${editingRep.profileDetails.profileImage}`}
                alt="Current profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                <User className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <label
              htmlFor="profileImage"
              className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 border border-gray-200 cursor-pointer hover:bg-gray-50"
            >
              <input
                id="profileImage"
                name="profileImage"
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </label>
          </div>
          <div className="flex-1">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.profileDetails.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              required
              className="bg-white"
            />
          </div>
        </div>
        {/* Contact Information */}
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
            className="bg-white"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone (e.g., +8801XXXXXXXXX)"
            required
            className="bg-white"
          />
        </div>
        {/* Security */}
        <div>
          <Label htmlFor="password">
            Password {editingRep && "(Leave blank to keep current)"}
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder={editingRep ? "New password" : "Password"}
            required={!editingRep}
            className="bg-white"
          />
        </div>
        {/* Professional Information */}
        <div>
          <Label htmlFor="designation">Designation *</Label>
          <Select
            value={formData.designation}
            onValueChange={(value) => handleSelectChange("designation", value)}
            required
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Senior Counselor">Senior Counselor</SelectItem>
              <SelectItem value="Junior Counselor">Junior Counselor</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Team Lead">Team Lead</SelectItem>
              <SelectItem value="Executive">Executive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="joiningDate">Joining Date *</Label>
          <Input
            id="joiningDate"
            name="joiningDate"
            type="date"
            value={formData.joiningDate}
            onChange={handleInputChange}
            required
            className="bg-white"
          />
        </div>
      </div>
      
      {/* Lead Assignment - For both create and edit */}
      <div className="space-y-2">
        <Label>
          {editingRep ? "Manage Leads" : "Assign Leads"}
        </Label>
        {/* Simple Dropdown Implementation */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex justify-between items-center p-2 border rounded-md bg-white"
          >
            <span>
              {editingRep 
                ? `Manage leads (${formData.assignedLeads.length} selected)` 
                : `Select leads (${formData.assignedLeads.length} selected)`
              }
            </span>
            <svg
              className={`h-4 w-4 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto">
              {leads.length === 0 ? (
                <div className="p-2 text-sm text-gray-500">
                  No leads available
                </div>
              ) : (
                <ul className="py-1">
                  {leads.map((lead) => {
                    const isSelected = formData.assignedLeads.includes(lead._id);
                    const isAssignedToThisRep = editingRep && lead.assignedTo === editingRep._id;
                    
                    return (
                      <li 
                        key={lead._id} 
                        className={`px-2 py-1 hover:bg-gray-50 ${isAssignedToThisRep ? 'bg-blue-50' : ''}`}
                      >
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleLeadSelection(lead._id)}
                            className="rounded"
                          />
                          <span className="flex-1">
                            {lead.fullName} ({lead.leadId})
                          </span>
                          {isAssignedToThisRep && (
                            <Badge variant="outline" className="text-xs">
                              Assigned
                            </Badge>
                          )}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
        {/* Selected Leads Display */}
        {formData.assignedLeads.length > 0 && (
          <div className="mt-2">
            <div className="flex flex-wrap gap-2">
              {formData.assignedLeads.map((leadId) => {
                const lead = leads.find((l) => l._id === leadId);
                const isAssignedToThisRep = editingRep && lead?.assignedTo === editingRep._id;
                
                return (
                  <Badge
                    key={leadId}
                    variant={isAssignedToThisRep ? "default" : "secondary"}
                    className="flex items-center gap-1"
                  >
                    {lead?.fullName || lead?.leadId || leadId}
                    <button
                      type="button"
                      onClick={() => removeLead(leadId)}
                      className="ml-1 rounded-full hover:bg-gray-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
        {editingRep && (
          <p className="text-sm text-gray-500">
            Unchecking a lead will unassign it from this representative.
          </p>
        )}
      </div>
      
      <Separator />
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full hover:bg-blue/80 hover:text-white"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : editingRep ? (
          "Update Representative"
        ) : (
          "Create Representative"
        )}
      </Button>
    </form>
  );
};

export default RepresentativeForm;
"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, User, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useGetAllRepresentativesQuery } from "@/redux/features/crm/representative.api";
import { useCreateRepresentativeMutation } from "@/redux/features/auth/admin.api";
import { useUpdateRepresentativeMutation, useDeleteRepresentativeMutation } from "@/redux/features/crm/representative.api";
import { useGetLeadsQuery } from "@/redux/features/crm/crm.api";
import { baseUrl } from "@/redux/api/api";
import RepresentativeForm from "../_components/RepresentativeForm.jsx";

export default function RepresentativesPage() {
  const {
    data: representatives,
    isLoading: repLoading,
    error: repError,
    refetch: refetchRepresentatives,
  } = useGetAllRepresentativesQuery();
  
  // Use the same query as reference code to get unassigned leads
  const {
    data: leadsResponse,
    isLoading: leadsLoading,
    error: leadsError,
  } = useGetLeadsQuery({ status: "new" });
  
  // Extract leads array from the response
  const unassignedLeads = Array.isArray(leadsResponse) ? leadsResponse : (leadsResponse?.data || []);
  
  const [createRepresentative, { isLoading: isCreating }] =
    useCreateRepresentativeMutation();
  const [updateRepresentative, { isLoading: isUpdating }] =
    useUpdateRepresentativeMutation();
  const [deleteRepresentative, { isLoading: isDeleting }] =
    useDeleteRepresentativeMutation();
    
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRep, setEditingRep] = useState(null);
  const [allLeads, setAllLeads] = useState([]); // All leads for edit mode
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    designation: "",
    joiningDate: "",
    profileDetails: {
      fullName: "",
      profileImage: null,
    },
    assignedLeads: [],
  });

  // Fetch all leads when component mounts
  useEffect(() => {
    const fetchAllLeads = async () => {
      try {
        const response = await fetch(`${baseUrl}/leads`);
        const data = await response.json();
        setAllLeads(Array.isArray(data) ? data : (data.data || []));
      } catch (error) {
        console.error("Failed to fetch all leads:", error);
        setAllLeads([]);
      }
    };
    
    fetchAllLeads();
  }, []);

  // Open modal for creating a new representative
  const openCreateModal = () => {
    setEditingRep(null);
    setFormData({
      email: "",
      phone: "",
      password: "",
      designation: "",
      joiningDate: "",
      profileDetails: {
        fullName: "",
        profileImage: null,
      },
      assignedLeads: [],
    });
    setIsModalOpen(true);
  };

  // Open modal for editing a representative
  const openEditModal = async (rep) => {
    setEditingRep(rep);
    
    // Fetch all leads and assigned leads for this representative
    try {
      // Get all leads
      const allLeadsResponse = await fetch(`${baseUrl}/leads`);
      const allLeadsData = await allLeadsResponse.json();
      const allLeadsArray = Array.isArray(allLeadsData) ? allLeadsData : (allLeadsData.data || []);
      setAllLeads(allLeadsArray);
      
      // Get leads assigned to this representative
      const assignedLeadsResponse = await fetch(`${baseUrl}/leads?assignedTo=${rep._id}`);
      const assignedLeadsData = await assignedLeadsResponse.json();
      const assignedLeadsArray = Array.isArray(assignedLeadsData) ? assignedLeadsData : (assignedLeadsData.data || []);
      
      // Set form data with assigned lead IDs
      setFormData({
        email: rep.email,
        phone: rep.phone,
        password: "", // Don't pre-fill password for security
        designation: rep.designation,
        joiningDate: rep.joiningDate ? new Date(rep.joiningDate).toISOString().split('T')[0] : "",
        profileDetails: {
          fullName: rep.profileDetails?.fullName || "",
          profileImage: null,
        },
        assignedLeads: assignedLeadsArray.map(lead => lead._id),
      });
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      setFormData({
        email: rep.email,
        phone: rep.phone,
        password: "",
        designation: rep.designation,
        joiningDate: rep.joiningDate ? new Date(rep.joiningDate).toISOString().split('T')[0] : "",
        profileDetails: {
          fullName: rep.profileDetails?.fullName || "",
          profileImage: null,
        },
        assignedLeads: [],
      });
    }
    
    setIsModalOpen(true);
  };

  // Handle form submission for both create and edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, phone, password, designation, joiningDate, profileDetails, assignedLeads } =
      formData;
    
    if (
      !email ||
      !phone ||
      !designation ||
      !joiningDate ||
      !profileDetails.fullName
    ) {
      toast.error(
        <div className="space-y-1">
          <div className="font-semibold">Error</div>
          <div>All required fields must be provided.</div>
        </div>
      );
      return;
    }
    
    // Password is required for create, optional for edit
    if (!editingRep && !password) {
      toast.error(
        <div className="space-y-1">
          <div className="font-semibold">Error</div>
          <div>Password is required for new representatives.</div>
        </div>
      );
      return;
    }
    
    const formDataToSend = new FormData();
    formDataToSend.append("email", email);
    formDataToSend.append("phone", phone);
    formDataToSend.append("designation", designation);
    formDataToSend.append("joiningDate", joiningDate);
    formDataToSend.append("profileDetails[fullName]", profileDetails.fullName);
    
    // Only include password if it's provided (for create or edit)
    if (password) {
      formDataToSend.append("password", password);
    }
    
    // Append assigned leads (for both create and edit)
    if (assignedLeads && assignedLeads.length > 0) {
      assignedLeads.forEach((leadId) => {
        formDataToSend.append("assignedLeads", leadId);
      });
    }
    
    if (profileDetails.profileImage) {
      formDataToSend.append("image", profileDetails.profileImage);
    }
    
    try {
      if (editingRep) {
        // Update existing representative
        await updateRepresentative({
          id: editingRep._id,
          body: formDataToSend,
        }).unwrap();
        toast.success(
          <div className="space-y-1">
            <div className="font-semibold">Success</div>
            <div>Representative updated successfully.</div>
            {assignedLeads && assignedLeads.length > 0 && (
              <div>{assignedLeads.length} leads assigned to the representative.</div>
            )}
          </div>
        );
      } else {
        // Create new representative
        await createRepresentative(formDataToSend).unwrap();
        toast.success(
          <div className="space-y-1">
            <div className="font-semibold">Success</div>
            <div>Representative created successfully.</div>
            {assignedLeads && assignedLeads.length > 0 && (
              <div>{assignedLeads.length} leads assigned to the representative.</div>
            )}
          </div>
        );
      }
      
      setIsModalOpen(false);
      refetchRepresentatives();
    } catch (error) {
      toast.error(
        <div className="space-y-1">
          <div className="font-semibold">Error</div>
          <div>
            {editingRep ? "Failed to update representative: " : "Failed to create representative: "}
            {error?.data?.message || error.message}
          </div>
        </div>
      );
    }
  };

  // Handle representative deletion
  const handleDelete = async (rep) => {
    if (window.confirm(`Are you sure you want to delete ${rep.profileDetails?.fullName || rep.email}?`)) {
      try {
        await deleteRepresentative(rep._id).unwrap();
        toast.success(
          <div className="space-y-1">
            <div className="font-semibold">Success</div>
            <div>Representative deleted successfully.</div>
          </div>
        );
        refetchRepresentatives();
      } catch (error) {
        toast.error(
          <div className="space-y-1">
            <div className="font-semibold">Error</div>
            <div>Failed to delete representative: {error?.data?.message || error.message}</div>
          </div>
        );
      }
    }
  };

  if (repLoading || leadsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-main" />
      </div>
    );
  }

  if (repError || leadsError) {
    toast.error(
      <div className="space-y-1">
        <div className="font-semibold">Error</div>
        <div>Failed to load data.</div>
      </div>
    );
    return <div className="text-red p-4">Failed to load data</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <Card className="p-5 border-l-4 border-gray1">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-main">Representatives</h1>
          <Button onClick={openCreateModal} className="hover:bg-blue/80 hover:text-white gap-1">
            <Plus className="h-4 w-4" />
            Add Representative
          </Button>
        </div>
        
        {/* Representatives List */}
        {representatives?.length === 0 ? (
          <p className="text-gray-500">No representatives found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Assigned Leads</TableHead>
                <TableHead>Joining Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {representatives?.map((rep) => (
                <TableRow
                  key={rep._id}
                  className={rep.isActive ? "" : "bg-gray-100"}
                >
                  <TableCell>
                    {rep.profileDetails?.profileImage ? (
                      <img
                        src={`${baseUrl}/${rep.profileDetails.profileImage}`}
                        alt={`${rep.profileDetails.fullName}'s profile`}
                        className="w-10 h-10 rounded-full object-cover border"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "";
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{rep.profileDetails?.fullName || "N/A"}</TableCell>
                  <TableCell>{rep.email}</TableCell>
                  <TableCell>{rep.phone}</TableCell>
                  <TableCell>{rep.employeeId}</TableCell>
                  <TableCell>{rep.designation}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {rep.performance?.totalLeadsAssigned || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {rep.joiningDate
                      ? new Date(rep.joiningDate).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {rep.isActive ? (
                      <span className="text-green-500">Active</span>
                    ) : (
                      <span className="text-red-500">Inactive</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(rep)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(rep)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
      
      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRep ? "Edit Representative" : "Create New Representative"}
            </DialogTitle>
          </DialogHeader>
          <RepresentativeForm
            formData={formData}
            setFormData={setFormData}
            leads={editingRep ? allLeads : unassignedLeads}  // Pass all leads for edit, unassigned for create
            onSubmit={handleSubmit}
            isLoading={isCreating || isUpdating}
            editingRep={editingRep}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
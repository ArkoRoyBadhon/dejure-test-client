"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import {
  useGetAllAboutQuery,
} from "@/redux/features/WebManage/About.api";
import ImagesDialog from "./_about/ImagesDialog";
import MentorsDialog from "./_about/MentorsDialog";
import TeamDialog from "./_about/TeamDialog";
import GeneralDialog from "./_about/GeneralDialog";

export default function ManageAbout() {
  const [openDialog, setOpenDialog] = useState(null); // null, 'images', 'mentors', 'team', 'general'
  const [aboutData, setAboutData] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    caption: "",
    video: "",
    visionTitle: "",
    visionDescription: "",
    missionTitle: "",
    missionDescription: "",
    coreValueTitle: "",
    coreValueDescription: "",
  });

  // Images state
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Mentors state
  const [mentors, setMentors] = useState([]);

  // Team state
  const [team, setTeam] = useState([]);

  // Track removed items
  const [removedMentors, setRemovedMentors] = useState([]);
  const [removedTeamMembers, setRemovedTeamMembers] = useState([]);

  // Mentor and team images
  const [mentorImages, setMentorImages] = useState([]);
  const [teamImages, setTeamImages] = useState([]);

  const { data, isLoading, refetch } = useGetAllAboutQuery();

  // Load data when component mounts or when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      const about = data[0];
      setAboutData(about);
      setFormData({
        title: about.title || "",
        description: about.description || "",
        caption: about.caption || "",
        video: about.video || "",
        visionTitle: about.visionTitle || "",
        visionDescription: about.visionDescription || "",
        missionTitle: about.missionTitle || "",
        missionDescription: about.missionDescription || "",
        coreValueTitle: about.coreValueTitle || "",
        coreValueDescription: about.coreValueDescription || "",
      });

      // Set existing images
      if (about.images) {
        setImagePreviews(
          about.images.map((img) => `${process.env.NEXT_PUBLIC_API_URL}/${img}`)
        );
      }

      // Set mentors
      if (about.mentors && about.mentors.length > 0) {
        setMentors(
          about.mentors.map((mentor) => ({
            ...mentor,
            image: mentor.image
              ? `${process.env.NEXT_PUBLIC_API_URL}/${mentor.image}`
              : null,
          }))
        );
      }

      // Set team
      if (about.team && about.team.length > 0) {
        setTeam(
          about.team.map((member) => ({
            ...member,
            image: member.image
              ? `${process.env.NEXT_PUBLIC_API_URL}/${member.image}`
              : null,
          }))
        );
      }
    }
  }, [data]);

  // Reset team state when dialog is closed
  const handleDialogClose = (dialogType) => {
    if (dialogType === "team") {
      // Reset removed team members when closing the team dialog
      setRemovedTeamMembers([]);
    } else if (dialogType === "mentors") {
      // Reset removed mentors when closing the mentors dialog
      setRemovedMentors([]);
    }
    setOpenDialog(dialogType);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage About Section</h1>
        <div className="flex gap-2">
          <Button onClick={() => setOpenDialog("images")}>
            {aboutData ? "Edit Images" : "Add Images"}
          </Button>
          <Button onClick={() => setOpenDialog("general")}>
            {aboutData ? "Edit General" : "Add General"}
          </Button>
          <Button onClick={() => setOpenDialog("mentors")}>
            {aboutData ? "Edit Mentors" : "Add Mentors"}
          </Button>
          <Button onClick={() => setOpenDialog("team")}>
            {aboutData ? "Edit Team" : "Add Team"}
          </Button>
        </div>
      </div>

      {/* Preview Section */}
      {aboutData && (
        <div className="border rounded-lg p-6">
          <div className="grid grid-cols-1  gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">{aboutData.title}</h3>
              <p className="text-gray-600 mb-4">{aboutData.description}</p>
            </div>
          </div>

          <div>
            {aboutData.images && aboutData.images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {aboutData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${image}`}
                      alt={`About image ${index + 1}`}
                      width={100}
                      height={100}
                      className="rounded-md object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            {aboutData.caption && (
              <p className="text-sm text-gray-500 italic">
                {aboutData.caption}
              </p>
            )}
          </div>

          {/* Vision Preview */}
          {aboutData.visionTitle && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800">
                {aboutData.visionTitle}
              </h4>
              <p className="text-gray-700 mt-2">
                {aboutData.visionDescription}
              </p>
            </div>
          )}

          {/* Mission Preview */}
          {aboutData.missionTitle && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800">
                {aboutData.missionTitle}
              </h4>
              <p className="text-gray-700 mt-2">
                {aboutData.missionDescription}
              </p>
            </div>
          )}

          {/* Core Values Preview */}
          {aboutData.coreValueTitle && (
            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800">
                {aboutData.coreValueTitle}
              </h4>
              <p className="text-gray-700 mt-2">
                {aboutData.coreValueDescription}
              </p>
            </div>
          )}

          {/* Mentors Preview */}
          {aboutData.mentors && aboutData.mentors.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Meet the Mentors</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aboutData.mentors.map((mentor, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 text-center"
                  >
                    {mentor.image && (
                      <div className="mx-auto mb-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${mentor.image}`}
                          alt={mentor.name}
                          width={80}
                          height={80}
                          className="rounded-full object-cover mx-auto"
                        />
                      </div>
                    )}
                    <h4 className="font-medium">{mentor.name}</h4>
                    <p className="text-sm text-gray-600">{mentor.position}</p>
                    <p className="text-xs text-gray-500">{mentor.department}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Preview */}
          {aboutData.team && aboutData.team.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Meet the Team</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aboutData.team.map((member, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 text-center"
                  >
                    {member.image && (
                      <div className="mx-auto mb-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${member.image}`}
                          alt={member.name}
                          width={80}
                          height={80}
                          className="rounded-full object-cover mx-auto"
                        />
                      </div>
                    )}
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.position}</p>
                    <p className="text-xs text-gray-500">{member.department}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dialogs */}
      <ImagesDialog
        isOpen={openDialog === "images"}
        setIsOpen={(isOpen) => handleDialogClose(isOpen ? "images" : null)}
        formData={formData}
        setFormData={setFormData}
        images={images}
        setImages={setImages}
        imagePreviews={imagePreviews}
        setImagePreviews={setImagePreviews}
        aboutData={aboutData}
        refetch={refetch}
      />

      <GeneralDialog
        isOpen={openDialog === "general"}
        setIsOpen={(isOpen) => handleDialogClose(isOpen ? "general" : null)}
        formData={formData}
        setFormData={setFormData}
        aboutData={aboutData}
        refetch={refetch}
      />

      <MentorsDialog
        isOpen={openDialog === "mentors"}
        setIsOpen={(isOpen) => handleDialogClose(isOpen ? "mentors" : null)}
        mentors={mentors}
        setMentors={setMentors}
        mentorImages={mentorImages}
        setMentorImages={setMentorImages}
        removedMentors={removedMentors}
        setRemovedMentors={setRemovedMentors}
        aboutData={aboutData}
        refetch={refetch}
      />

      <TeamDialog
        isOpen={openDialog === "team"}
        setIsOpen={(isOpen) => handleDialogClose(isOpen ? "team" : null)}
        team={team}
        setTeam={setTeam}
        teamImages={teamImages}
        setTeamImages={setTeamImages}
        removedTeamMembers={removedTeamMembers}
        setRemovedTeamMembers={setRemovedTeamMembers}
        aboutData={aboutData}
        refetch={refetch}
      />
    </div>
  );
}
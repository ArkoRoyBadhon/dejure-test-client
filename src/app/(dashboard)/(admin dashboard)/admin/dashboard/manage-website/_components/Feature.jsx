import { ArrowRight, Check, Edit, Save, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/components/shared/Loader";
import {
  useGetAllHomeFeaturesQuery,
  useUpdateHomeFeatureMutation,
} from "@/redux/features/WebManage/HomeFeatures.api";

export default function ManageFeatures() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [imageFiles, setImageFiles] = useState({});

  const {
    data: features,
    isLoading,
    error,
    refetch,
  } = useGetAllHomeFeaturesQuery();
  const [updateHomeFeature] = useUpdateHomeFeatureMutation();

  useEffect(() => {
    if (features && features.length > 0 && !editingData) {
      setEditingData(features[0]);
    }
  }, [features]);

  const handleEditToggle = () => {
    if (isEditing) {
      // If we're turning off editing mode, reset to original data
      const originalFeature = features.find((f) => f._id === editingData._id);
      setEditingData(originalFeature);
      setImageFiles({});
    }
    setIsEditing(!isEditing);
  };

  const handleFieldChange = (field, value) => {
    setEditingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCardChange = (cardIndex, field, value) => {
    setEditingData((prev) => ({
      ...prev,
      cards: prev.cards.map((card, index) =>
        index === cardIndex ? { ...card, [field]: value } : card
      ),
    }));
  };

  const handleWhatsInChange = (cardIndex, itemIndex, value) => {
    setEditingData((prev) => ({
      ...prev,
      cards: prev.cards.map((card, index) =>
        index === cardIndex
          ? {
              ...card,
              whatsIn: card.whatsIn.map((item, i) =>
                i === itemIndex ? value : item
              ),
            }
          : card
      ),
    }));
  };

  const handleAddWhatsIn = (cardIndex) => {
    setEditingData((prev) => ({
      ...prev,
      cards: prev.cards.map((card, index) =>
        index === cardIndex
          ? {
              ...card,
              whatsIn: [...card.whatsIn, ""],
            }
          : card
      ),
    }));
  };

  const handleRemoveWhatsIn = (cardIndex, itemIndex) => {
    setEditingData((prev) => ({
      ...prev,
      cards: prev.cards.map((card, index) =>
        index === cardIndex
          ? {
              ...card,
              whatsIn: card.whatsIn.filter((_, i) => i !== itemIndex),
            }
          : card
      ),
    }));
  };

  const handleImageUpload = (cardIndex, e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFiles((prev) => ({ ...prev, [cardIndex]: file }));
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("title", editingData.title);
      formData.append("subTitle", editingData.subTitle);
      formData.append("cards", JSON.stringify(editingData.cards));

      // Append card images
      Object.entries(imageFiles).forEach(([cardIndex, file]) => {
        formData.append("images", file);
      });

      await updateHomeFeature({
        id: editingData._id,
        data: formData,
      }).unwrap();

      setIsEditing(false);
      setImageFiles({});
      refetch();
    } catch (error) {
      console.error("Failed to update feature:", error);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading features</div>;

  return (
    <section className="max-w-[1200px] mx-auto  pb-[70px] md:pb-2">
      {/* Display Features with Edit Mode */}
      <div className="space-y-8">
        {editingData && (
          <div className="border rounded-lg p-6">
            {/* Title and Subtitle Editing */}
            <div className="mb-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={editingData.title}
                      onChange={(e) =>
                        handleFieldChange("title", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="subTitle">Subtitle</Label>
                    <Input
                      id="subTitle"
                      value={editingData.subTitle}
                      onChange={(e) =>
                        handleFieldChange("subTitle", e.target.value)
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-2xl font-bold">{editingData.title}</h3>
                  <p className="text-gray-600">{editingData.subTitle}</p>
                </div>
              )}
            </div>

            {/* Cards Editing */}
            <div className="flex flex-col md:flex-row gap-6">
              {editingData.cards.map((card, cardIndex) => (
                <div
                  key={cardIndex}
                  className="bg-main rounded-2xl p-8 relative flex-1"
                >
                  <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center z-[0] opacity-5" />

                  <div className="relative z-[1]">
                    {/* {isEditing && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute -top-3 -right-3 z-10"
                        onClick={() => handleRemoveCard(cardIndex)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )} */}

                    {card.image && (
                      <Image
                        alt={card.title}
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${card.image}`}
                        width={80}
                        height={80}
                        className="w-15 h-15 lg:w-[75px] lg:h-[75px]  -top-3 -right-5 md:right-0 mb-6"
                      />
                    )}

                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label>Card Title</Label>
                          <Input
                            value={card.title}
                            onChange={(e) =>
                              handleCardChange(
                                cardIndex,
                                "title",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div>
                          <Label>
                            Card Image (size: 150×150 px.){" "}
                            <a
                              href="https://imageresizer.com/"
                              className="underline text-blue-600"
                            >
                              Resizer
                            </a>{" "}
                          </Label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(cardIndex, e)}
                            className="cursor-pointer"
                          />
                          {imageFiles[cardIndex] && (
                            <p className="text-sm text-gray-500 mt-1">
                              New image: {imageFiles[cardIndex].name}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label>Link</Label>
                          <Input
                            value={card.link}
                            onChange={(e) =>
                              handleCardChange(
                                cardIndex,
                                "link",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div>
                          <Label>Features</Label>
                          {card.whatsIn.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex gap-2 mb-2">
                              <Input
                                value={item}
                                onChange={(e) =>
                                  handleWhatsInChange(
                                    cardIndex,
                                    itemIndex,
                                    e.target.value
                                  )
                                }
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  handleRemoveWhatsIn(cardIndex, itemIndex)
                                }
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddWhatsIn(cardIndex)}
                          >
                            Add Feature
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-bold text-2xl md:text-3xl text-darkColor">
                          {card.title}
                        </h4>

                        <div className="space-y-2 mt-7">
                          {card.whatsIn.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-4 text-darkColor"
                            >
                              <div className="h-5 w-5 bg-white rounded-full flex items-center justify-center">
                                <Check strokeWidth={5} className="w-3 h-3" />
                              </div>
                              <p>{item}</p>
                            </div>
                          ))}
                        </div>

                        {card.link && (
                          <Link
                            href={card.link}
                            className="w-10 h-10 lg:w-14 lg:h-14 bg-white flex items-center justify-center rounded-full absolute -right-5 md:right-0 -bottom-5 md:bottom-0"
                          >
                            <ArrowRight className="-rotate-45 text-darkColor w-6" />
                          </Link>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}

              {/* {isEditing && (
                <div className="bg-gray-100 rounded-2xl p-8 flex items-center justify-center">
                  <Button
                    onClick={handleAddCard}
                    className="flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Add Card
                  </Button>
                </div>
              )} */}
            </div>
          </div>
        )}
      </div>

      {/* Header with Edit/Save Button */}
      <div className="flex justify-center items-center mt-6 px-4">
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleUpdate}
                className="flex items-center gap-2"
              >
                <Save size={20} />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleEditToggle}>
                Cancel
              </Button>
            </>
          ) : (
            <Button
              onClick={handleEditToggle}
              className="flex items-center gap-2"
            >
              <Edit size={20} />
              Edit Features
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

"use client";
"use client";

import { useState } from "react";
import { images } from "@/utils/images";
import Image from "next/image";
import Link from "next/link";
import { BsFillCheckSquareFill, BsGithub, BsLinkedin } from "react-icons/bs";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

export default function Home() {
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState(null); // New state for selected file
  const [updatedImages, setupdatedImages] = useState<any>(images);

  const handleImageClick = (imgId: number) => {
    if (selectedImages.includes(imgId)) {
      setSelectedImages(selectedImages.filter((id) => id !== imgId));
    } else {
      setSelectedImages([...selectedImages, imgId]);
    }
  };

  const handleDeleteSelected = () => {
    const updatedImages = images.filter(
      (img: any) => !selectedImages.includes(img.id)
    );

    setSelectedImages([]);
    setupdatedImages(updatedImages);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const reorderedImages = Array.from(updatedImages);
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);

    setupdatedImages(reorderedImages);
  };

  return (
    <main className="max-w-5xl mx-auto my-20 bg-white p-4 border rounded-md">
      <div className="border-b pb-2 mb-6 flex items-center justify-between">
        <h1 className="text-2xl flex items-center font-bold">
          {selectedImages.length > 0 && (
            <span className="text-blue-500 ml-2">
              <BsFillCheckSquareFill />
            </span>
          )}
          {selectedImages.length > 0
            ? `    ${selectedImages.length}   Files Selected`
            : "Gallery"}
        </h1>

        {selectedImages.length > 0 && (
          <button
            className="text-red-500 font-semibold py-1 px-3 rounded-md"
            onClick={handleDeleteSelected}
          >
            Delete Selected
          </button>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="image-gallery" type="DEFAULT">
          {(provided: any) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className=" grid grid-cols-5 grid-rows-3 gap-4"
            >
              {updatedImages.map((img: any, index: number) => (
                <Draggable
                  key={img.id}
                  draggableId={img.id.toString()}
                  index={index}
                >
                  {(provided: any) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`relative overflow-hidden border rounded-lg cursor-pointer transition-all duration-300 hover:opacity-40 ${
                        index === 0 ? "col-span-2 row-span-2" : ""
                      } `}
                      onClick={() => handleImageClick(img.id)}
                    >
                      <Image
                        src={img.src}
                        alt={img.title}
                        width={1080}
                        height={1080}
                      />

                      {selectedImages.includes(img.id) && (
                        <span className="absolute left-4 top-4 text-blue-700">
                          <BsFillCheckSquareFill />
                        </span>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Display the selected image */}
      {selectedFile && (
        <div className="mt-4">
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Selected Image"
            width={200}
          />
        </div>
      )}
    </main>
  );
}

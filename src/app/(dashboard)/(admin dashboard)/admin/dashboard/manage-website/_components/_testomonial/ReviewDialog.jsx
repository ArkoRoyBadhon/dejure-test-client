"use client";
import { useState } from "react";

const { Button } = require("@/components/ui/button");
const { DialogFooter } = require("@/components/ui/dialog");
const { Input } = require("@/components/ui/input");
const { Textarea } = require("@/components/ui/textarea");

// Form for Create/Update
export default function ReviewForm({ initial, onSubmit, loading }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    designation: initial?.designation || "",
    rating: initial?.rating || 5,
    comment: initial?.comment || "",
    image: null,
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <Input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        required
      />
      <Input
        placeholder="Designation"
        value={form.designation}
        onChange={(e) =>
          setForm((f) => ({ ...f, designation: e.target.value }))
        }
        required
      />
      <Input
        type="number"
        min={1}
        max={5}
        placeholder="Rating (1-5)"
        value={form.rating}
        onChange={(e) =>
          setForm((f) => ({ ...f, rating: Number(e.target.value) }))
        }
        required
      />
      <Textarea
        placeholder="Comment"
        value={form.comment}
        onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
        required
      />

      <label className="block text-sm font-medium leading-6 text-gray-900">
        Image (100x100 px recommended){" "}
        <a href="https://imageresizer.com/" className="underline text-blue-600">
          Resizer
        </a>
      </label>
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => setForm((f) => ({ ...f, image: e.target.files[0] }))}
        className="cursor-pointer"
      />
      <DialogFooter>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogFooter>
    </form>
  );
}

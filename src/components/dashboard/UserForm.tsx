"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface UserFormProps {
  user?: any;
  onSubmit?: (data: FormData) => Promise<void>;
}

export default function UserForm({ user, onSubmit }: UserFormProps) {
  const [preview, setPreview] = useState<string | null>(user?.avatarUrl || null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    if (onSubmit) {
      await onSubmit(formData);
    }
    setLoading(false);
    router.push("/dashboard/admin/users");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
      <div className="flex flex-col items-center gap-2">
        {preview ? (
          <Image src={preview} alt="Avatar" width={80} height={80} className="rounded-full object-cover" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
            ?
          </div>
        )}
        <input type="file" name="avatar" accept="image/*" onChange={handleFileChange} className="mt-2" />
      </div>
      <div>
        <label className="block mb-1">Nome</label>
        <input name="name" defaultValue={user?.name || ""} required className="input input-bordered w-full" />
      </div>
      <div>
        <label className="block mb-1">Email</label>
        <input name="email" type="email" defaultValue={user?.email || ""} required className="input input-bordered w-full" />
      </div>
      <div>
        <label className="block mb-1">Função</label>
        <select name="role" defaultValue={user?.role || "Operator"} className="input input-bordered w-full">
          <option value="Admin">Admin</option>
          <option value="Operator">Operator</option>
        </select>
      </div>
      {!user && (
        <div>
          <label className="block mb-1">Senha</label>
          <input name="password" type="password" required className="input input-bordered w-full" />
        </div>
      )}
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}

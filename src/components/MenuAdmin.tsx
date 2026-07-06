"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

type MenuSetting = {
  id: number;
  key: string;
  visible: boolean;
};

export default function MenuAdmin() {
  const [settings, setSettings] = useState<MenuSetting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/menu-settings");
      const data = await res.json();
      if (res.ok) setSettings(data);
    } catch (error) {
      toast.error("Failed to load menu settings");
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (key: string, currentVisible: boolean) => {
    try {
      const res = await fetch("/api/menu-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, visible: !currentVisible }),
      });

      if (!res.ok) throw new Error("Failed to update setting");
      
      setSettings((prev) =>
        prev.map((s) => (s.key === key ? { ...s, visible: !currentVisible } : s))
      );
      toast.success("Menu visibility updated");
    } catch (error) {
      toast.error("Failed to update menu visibility");
    }
  };

  const formatKeyName = (key: string) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return <div className="text-center py-10">Loading menu settings...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 max-w-4xl">
      <h2 className="text-xl font-bold text-gray-900 mb-6 font-cinzel">Navigation Menu Visibility</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-900">Menu Item</th>
              <th className="px-4 py-3 font-semibold text-gray-900">Status</th>
              <th className="px-4 py-3 font-semibold text-gray-900 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {settings.map((setting) => (
              <tr key={setting.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 font-medium text-gray-900">
                  {formatKeyName(setting.key)}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      setting.visible
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {setting.visible ? "Visible" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    onClick={() => toggleVisibility(setting.key, setting.visible)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      setting.visible
                        ? "text-red-700 bg-red-50 hover:bg-red-100"
                        : "text-green-700 bg-green-50 hover:bg-green-100"
                    }`}
                  >
                    {setting.visible ? (
                      <>
                        <EyeOff className="w-4 h-4" /> Hide
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" /> Show
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

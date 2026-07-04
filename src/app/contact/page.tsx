"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Video, CheckCircle, Upload, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    productInterest: "Epoxy Flooring",
    budget: "",
    appointmentDate: "",
    message: ""
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";
      
      // Upload image if present
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/contact-upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          imageUrl = data.url;
        } else {
          toast.error("Failed to upload image. Sending message without it.");
        }
      }

      // Format WhatsApp Message
      const waNumber = "+918319668016";
      let text = `*New Video Call / Inquiry Request*\n\n`;
      text += `*Name:* ${form.name}\n`;
      text += `*Email:* ${form.email}\n`;
      text += `*Phone:* ${form.phone}\n`;
      text += `*Location:* ${form.city}, ${form.country}\n`;
      text += `*Product Interest:* ${form.productInterest}\n`;
      text += `*Budget:* ${form.budget}\n`;
      if (form.appointmentDate) text += `*Requested Appointment:* ${new Date(form.appointmentDate).toLocaleString()}\n`;
      text += `*Message:* ${form.message}\n`;
      if (imageUrl) text += `*Reference Image:* ${imageUrl}\n`;

      const encodedText = encodeURIComponent(text);
      window.open(`https://wa.me/${waNumber.replace("+", "")}?text=${encodedText}`, "_blank");
      
      setSent(true);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 pb-20 font-sans text-gray-900">
      {/* Header */}
      <div className="relative py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-teal-500" style={{ fontFamily: "var(--font-heading)" }}>
          Let's Connect
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto px-4">
          Request a video consultation, inquire about custom orders, or share your project requirements with us.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Contact Info */}
          <div className="lg:col-span-4">
            <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
            <div className="space-y-6">
              {[
                { icon: <Mail className="w-5 h-5" />, label: "Email", value: "info@srikrishnacrafting.com" },
                { icon: <Phone className="w-5 h-5" />, label: "Phone", value: "+91 831 966 8016" },
                { icon: <MapPin className="w-5 h-5" />, label: "Address", value: "Indore, Bengalore" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white border border-gray-200 shadow-sm rounded-lg flex items-center justify-center flex-shrink-0" style={{ color: "var(--peacock-blue)" }}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-0.5">{item.label}</p>
                    <p className="font-semibold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
              <h3 className="font-bold mb-4">Consultation Hours</h3>
              <div className="space-y-3 text-sm font-medium text-gray-600">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span>Mon – Fri</span>
                  <span className="text-gray-900">10:00 AM – 7:00 PM</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span>Saturday</span>
                  <span className="text-gray-900">10:00 AM – 4:00 PM</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span>Sunday</span>
                  <span className="text-red-500">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Comprehensive Form */}
          <div className="lg:col-span-8 bg-white border border-gray-200 shadow-xl rounded-2xl p-6 sm:p-10">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
                <h3 className="text-3xl font-black mb-2">Request Initiated!</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                  Your WhatsApp application should have opened with your pre-filled details. Please send the message to complete your request.
                </p>
                <button
                  onClick={() => { setSent(false); setFile(null); }}
                  className="px-8 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <h2 className="text-xl font-bold">Project Details</h2>
                  <p className="text-sm text-gray-500">Fill out the form below to request a video call consultation.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Name *</label>
                    <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email *</label>
                    <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors" placeholder="john@example.com" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone (WhatsApp) *</label>
                    <input type="tel" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors" placeholder="+91..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Country</label>
                    <input type="text" value={form.country} onChange={e => setForm({...form, country: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors" placeholder="e.g. India" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">City</label>
                    <input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors" placeholder="e.g. Mumbai" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Product Interest *</label>
                    <select required value={form.productInterest} onChange={e => setForm({...form, productInterest: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors appearance-none">
                      <option>Epoxy Flooring</option>
                      <option>River Tables</option>
                      <option>Countertops</option>
                      <option>Mandir Design</option>
                      <option>Wall Art</option>
                      <option>Bulk Orders / Corporate Gifts</option>
                      <option>Trainings & Workshops</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Budget Range</label>
                    <select value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors appearance-none">
                      <option value="">Select a range</option>
                      <option>Under ₹10,000</option>
                      <option>₹10,000 - ₹50,000</option>
                      <option>₹50,000 - ₹1,00L</option>
                      <option>₹1,00L+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Preferred Appointment Date</label>
                    <input type="datetime-local" value={form.appointmentDate} onChange={e => setForm({...form, appointmentDate: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Project Description / Message *</label>
                  <textarea rows={4} required value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors resize-none" placeholder="Describe what you are looking for..." />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Reference Image (Optional)</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 border-dashed rounded-xl cursor-pointer hover:bg-gray-100 transition-colors text-sm font-medium text-gray-600">
                      <Upload className="w-4 h-4" />
                      {file ? file.name : "Upload Image"}
                      <input type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
                    </label>
                    {file && <span className="text-xs text-green-600 font-bold">Image attached ✓</span>}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 hover:bg-black text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-70"
                    style={{ backgroundColor: "var(--peacock-blue)" }}
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Video className="w-5 h-5" />
                        Video Call Request
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Securely initiates a WhatsApp conversation
                  </p>
                </div>

              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

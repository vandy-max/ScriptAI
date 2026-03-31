import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Youtube, Target, Edit2, Save, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";

const Profile = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    setLoading(true);
    apiFetch("/api/profile")
      .then((data) => {
        setProfile(data);
        setEditedProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setLoading(false);
      });
  };

  const handleSave = async () => {
    try {
      await apiFetch("/api/profile", {
        method: "POST",
        body: JSON.stringify(editedProfile),
      });
      setProfile(editedProfile);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (err) {
      console.error("Error saving profile:", err);
      toast({
        title: "Error",
        description: "Failed to save profile changes.",
        variant: "destructive",
      });
    }
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const fields = [
    { key: "fullName", label: "Full Name", value: profile.fullName, icon: User },
    { key: "email", label: "Email", value: profile.email, icon: Mail },
    { key: "channelName", label: "Channel", value: profile.channelName, icon: Youtube },
    { key: "niche", label: "Niche", value: profile.niche, icon: Target },
  ];

  return (
    <motion.div className="min-h-screen pb-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Navbar isAuthenticated />

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex justify-between items-end">
          <div>
            <h1 className="font-display text-4xl font-bold gradient-text mb-2">Your Profile</h1>
            <p className="text-muted-foreground">Manage your account and channel preferences.</p>
          </div>
          <button
            onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-secondary/50 transition-colors cursor-pointer text-sm font-medium"
          >
            {isEditing ? <><X className="w-4 h-4" /> Cancel</> : <><Edit2 className="w-4 h-4" /> Edit Profile</>}
          </button>
        </motion.div>

        {/* Avatar Section */}
        <motion.div className="glass-strong rounded-3xl p-8 flex items-center gap-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-2xl" style={{ background: "var(--gradient-primary)" }}>
              {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : "U"}
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-bold text-foreground">{profile.fullName}</h2>
            <p className="text-muted-foreground flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">PRO CREATOR</span>
              @{profile.username}
            </p>
          </div>
        </motion.div>

        {/* Form / Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {fields.map((field, i) => (
            <motion.div key={field.label} className="glass rounded-2xl p-6 space-y-2 border border-white/5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <field.icon className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-tight">{field.label}</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile[field.key]}
                  onChange={(e) => setEditedProfile({ ...editedProfile, [field.key]: e.target.value })}
                  className="w-full bg-secondary/30 rounded-lg px-3 py-2 text-foreground outline-none focus:ring-1 focus:ring-primary/50 text-sm"
                />
              ) : (
                <p className="font-display text-lg font-semibold text-foreground">{field.value}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Channel Details */}
        <motion.div className="glass rounded-3xl p-8 space-y-6 border border-white/5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-500" /> Channel Insights
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: "subscribers", label: "Subscribers", value: profile.subscribers },
              { key: "contentType", label: "Content Type", value: profile.contentType },
              { key: "frequency", label: "Frequency", value: profile.frequency },
              { key: "goal", label: "Growth Goal", value: profile.goal },
            ].map((item) => (
              <div key={item.label} className="bg-secondary/20 rounded-2xl p-4 border border-white/5 group hover:bg-secondary/40 transition-colors">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile[item.key]}
                    onChange={(e) => setEditedProfile({ ...editedProfile, [item.key]: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 text-foreground outline-none text-xs py-1"
                  />
                ) : (
                  <p className="font-display font-bold text-foreground text-sm">{item.value}</p>
                )}
              </div>
            ))}
          </div>
          <div className="bg-secondary/20 rounded-2xl p-5 border border-white/5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Channel Vision</p>
            {isEditing ? (
              <textarea
                value={editedProfile.vision}
                onChange={(e) => setEditedProfile({ ...editedProfile, vision: e.target.value })}
                className="w-full bg-transparent border-b border-white/10 text-foreground outline-none text-sm py-1 min-h-[80px] resize-none"
              />
            ) : (
              <p className="text-sm text-foreground leading-relaxed">{profile.vision}</p>
            )}
          </div>
        </motion.div>

        {/* Save Button */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex justify-center pt-4"
            >
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white shadow-2xl hover:scale-105 transition-transform cursor-pointer"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Save className="w-5 h-5" /> Save Changes
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Profile;


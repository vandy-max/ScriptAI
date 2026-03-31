import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, LogIn, UserPlus, User, History, Sparkles } from "lucide-react";

interface NavbarProps {
  isAuthenticated?: boolean;
}

const Navbar = ({ isAuthenticated = false }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const publicLinks = [
    { label: "Home", path: "/dashboard", icon: Home },
    { label: "Sign In", path: "/signin", icon: LogIn },
    { label: "Sign Up", path: "/signup", icon: UserPlus },
  ];

  const authLinks = [
    { label: "Home", path: "/app", icon: Home },
    { label: "Inspiration", path: "/inspiration", icon: Sparkles },
    { label: "History", path: "/history", icon: History },
    { label: "Profile", path: "/profile", icon: User },
  ];

  const links = isAuthenticated ? authLinks : publicLinks;

  return (
    <motion.nav
      className="glass sticky top-0 z-40 px-6 py-3 flex items-center justify-between"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.button
        className="flex items-center gap-2 cursor-pointer"
        whileHover={{ scale: 1.03 }}
        onClick={() => navigate(isAuthenticated ? "/app" : "/dashboard")}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-display font-bold text-lg text-foreground">
          ScriptAI
        </span>
      </motion.button>

      <div className="flex items-center gap-1">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <motion.button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <link.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{link.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default Navbar;

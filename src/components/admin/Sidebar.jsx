import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";

const Sidebar = () => {
  const navItems = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: assets.home_icon,
    },
    {
      label: "Add Blogs",
      path: "/admin/addblog",
      icon: assets.add_icon,
    },
    {
      label: "Blog Lists",
      path: "/admin/listblog",
      icon: assets.list_icon,
    },
    {
      label: "Comments",
      path: "/admin/comments",
      icon: assets.comment_icon,
    },
  ];

  return (
    <div className="flex flex-col gap-1 w-full">
      {navItems.map(({ label, path, icon }) => (
        <NavLink
          key={path}
          end={path === "/admin"}
          to={path}
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-5 md:px-9 w-full transition-all duration-150 
             hover:bg-primary/5 hover:text-primary 
             ${
               isActive
                 ? "bg-primary/10 border-r-4 border-primary text-primary"
                 : ""
             }`
          }
        >
          <img src={icon} alt={`${label} icon`} className="w-5 min-w-5" />
          <p className="md:inline-block">{label}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;

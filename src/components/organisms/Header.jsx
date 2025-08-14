import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const Header = ({ cartItemCount, onCartOpen }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { to: "/", label: "Products", icon: "Package" },
    { to: "/templates", label: "Templates", icon: "Palette" }
  ];

  return (
    <header className="bg-white/95 backdrop-blur-lg sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink 
            to="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
          >
            <div className="bg-gradient-to-r from-primary to-primary-light p-2 rounded-xl">
              <ApperIcon name="Palette" className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-xl bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              PrintCraft
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-primary/10 to-primary-light/10 text-primary"
                      : "text-gray-600 hover:text-primary hover:bg-primary/5"
                  }`
                }
              >
                <ApperIcon name={item.icon} className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onCartOpen}
              className="relative"
            >
              <ApperIcon name="ShoppingCart" className="w-6 h-6" />
              {cartItemCount > 0 && (
                <Badge
                  variant="accent"
                  size="sm"
                  className="absolute -top-2 -right-2 min-w-[1.5rem] h-6 flex items-center justify-center"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-primary/10 to-primary-light/10 text-primary"
                        : "text-gray-600 hover:text-primary hover:bg-primary/5"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ApperIcon name={item.icon} className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
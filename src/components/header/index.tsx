import Link from "next/link";
import { useAuth } from "@/hooks/auth";
import { useLogout } from "@/hooks/auth/use-logout";
import { ThemeToggle } from "../theme-toggle";
import { Navbar } from "./navbar";
import { Button } from "../ui/button";
import { UserButton } from "./user-button";
import { SearchIcon, ShoppingCartIcon } from "lucide-react";


export function Header(){
    const { isAuthenticated, user, isLoading} = useAuth();
    const logout = useLogout();
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center px-4">
            <div className="flex gap-6 md:gap-10">
              {/* Logo */}
              <Link href="/" className="hidden md:flex items-center space-x-2 pl-2">
               
                <span className="hidden font-bold sm:inline-block">DiXemSex</span>
              </Link>
    
              {/* Mobile Logo */}
              <Link href="/" className="md:hidden pl-2">
              
              </Link>
    
              {/* Main Navigation */}
              <Navbar />
            </div>
    
            {/* Right Side Actions */}
            <div className="flex flex-1 items-center justify-end space-x-4">
              <div className="flex items-center gap-2">
                {/* Search Button */}
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <SearchIcon className="h-5 w-5" />
                </Button>
    
                {/* Cart Button */}
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/cart" className="relative">
                    <ShoppingCartIcon className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                      0
                    </span>
                  </Link>
                </Button>
    
                {/* Theme Toggle */}
                <ThemeToggle />
    
                {/* Auth Section */}
                {isLoading ? (
                  <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
                ) : isAuthenticated ? (
                  <UserButton user={user} onLogout={logout.mutate} />
                ) : (
                  <div className="hidden sm:flex items-center gap-2">
                    <Button variant="ghost" asChild>
                      <Link href="/auth/login">Đăng nhập</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/auth/register">Đăng ký</Link>
                    </Button>
                  </div>
                )}
    
               
              </div>
            </div>
          </div>
        </header>
      );
    }
    
    
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout, authStateListener, auth } from "@/firebase/firebase";
import { Button } from "@/components/ui/button";
import { Menu, Wallet } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import type { User } from 'firebase/auth';

import { LoginModal } from "@/components/auth/Login";

const Navbar = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            setLoading(false);
            if (!currentUser) {
                navigate('/');
            }
            else {
                navigate('/dashboard');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    if (loading) return null;

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };


    return (
        <nav className="border-b bg-white/50 backdrop-blur-sm fixed w-full z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Wallet className="h-6 w-6 text-primary" />
                    <span className="font-semibold text-lg">Budget</span>
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Menu className="h-6 w-6" />
                        </button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Menu</SheetTitle>
                        </SheetHeader>
                        {user ? (
                            <div className="mt-4">
                                <span>{user.displayName}</span>
                                <Button
                                    onClick={handleLogout}
                                    variant="ghost"
                                    className="w-full text-left justify-start mt-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <LoginModal triggerClassName="w-full text-left justify-start mt-6 px-4 py-2 text-sm bg-gray-300 text-blue-600 hover:bg-blue-50 rounded-lg">
                                Login
                            </LoginModal>
                        )}
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
};

export default Navbar;
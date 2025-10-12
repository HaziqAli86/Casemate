"use client";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth"; // Import the signOut function
import { useRouter } from "next/navigation"; // Import the router

export default function AuthButton() {
    const [user, loading, error] = useAuthState(auth);
    const router = useRouter(); // Initialize the router

    // --- Sign Out Logic ---
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            // After signing out, redirect the user to the homepage
            router.push('/');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    // While Firebase is checking the auth state, show a placeholder
    if (loading) {
        return (
            <div className="bg-gray-500 px-4 py-2 rounded animate-pulse w-[88px] h-[36px]"></div>
        );
    }

    return (
        <div>
            {user ? (
                // If the user is logged in, show the Sign Out button
                <button 
                    onClick={handleSignOut}
                    className="bg-gray-600 px-4 py-2 rounded text-white hover:bg-gray-500"
                >
                    Sign Out
                </button>
            ) : (
                // If the user is logged out, show a button to log in
                <Link 
                    href="/login" 
                    className="bg-[#e94560] px-4 py-2 rounded text-white hover:bg-[#d6324b]"
                >
                    Login
                </Link>
            )}
        </div>
    );
}
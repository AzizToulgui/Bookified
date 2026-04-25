// Marks this component as a Client Component, allowing us to use client-side features like hooks
'use client';

// Next.js imports for navigation and image optimization
import Link from "next/link";
import Image from "next/image";

// Import hook to get the current pathname for active link detection
import {usePathname} from "next/navigation";

// Import Clerk authentication components and hooks for user management
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";

// Import utility function for conditional class name merging
import {cn} from "@/lib/utils";

// Define the navigation items that will be displayed in the navbar
// Each item has a label (displayed text) and href (navigation destination)
const navItems = [
    { label: "Library", href: "/" },
    { label: "Add New", href: "/books/new" },
    { label: "Pricing", href: "/subscriptions" },
]

// Main Navbar component - renders the top navigation bar
const Navbar = () => {
    // Get the current page pathname to determine which nav link should be highlighted
    const pathName = usePathname();
    
    // Get the currently logged-in user's information from Clerk
    const { user } = useUser();

    return (
        // Fixed header that stays at the top with high z-index to appear above other content
        <header className="w-full fixed z-50 bg-(--bg-primary)">
            <div className="wrapper navbar-height py-4 flex justify-between items-center">
                {/* Logo section - links to home page */}
                <Link href="/" className="flex gap-0.5 items-center">
                    <Image src="/assets/logo.png" alt="Bookfied" width={42} height={26} />
                    <span className="logo-text">Bookified</span>
                </Link>

                {/* Main navigation */}
                <nav className="w-fit flex gap-7.5 items-center">
                    {/* Loop through all navigation items and create links */}
                    {navItems.map(({ label, href }) => {
                        // Check if the current page matches this nav item
                        // Active if exact match OR if it's a sub-route of the nav link (except for home "/")
                        const isActive = pathName === href || (href !== '/' && pathName.startsWith(href));

                        return (
                            <Link 
                                href={href} 
                                key={label} 
                                // Apply active styles if this is the current page, otherwise apply hover effects
                                className={cn('nav-link-base', isActive ? 'nav-link-active' : 'text-black hover:opacity-70')}
                            >
                                {label}
                            </Link>
                        )
                    })}

                    {/* User authentication section */}
                    <div className="flex gap-7.5 items-center">
                        {/* Show sign-in button if user is not logged in */}
                        <SignedOut>
                            <SignInButton mode="modal" />
                        </SignedOut>
                        
                        {/* Show user info if user is logged in */}
                        <SignedIn>
                            <div className="nav-user-link">
                                {/* Clerk UserButton component - displays user avatar and account menu */}
                                <UserButton />
                                
                                {/* Display user's first name as a link to subscriptions page */}
                                {user?.firstName && (
                                    <Link href="/subscriptions" className="nav-user-name">
                                        {user.firstName}
                                    </Link>
                                )}
                            </div>
                        </SignedIn>
                    </div>
                </nav>
            </div>
        </header>
    )
}

// Export the Navbar component as default
export default Navbar;
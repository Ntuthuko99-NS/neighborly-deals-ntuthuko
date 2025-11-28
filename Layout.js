import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import { 
    Home, 
    Search, 
    PlusCircle, 
    MessageCircle, 
    User, 
    MapPin,
    Bell
} from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Layout({ children, currentPageName }) {
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const currentUser = await base44.auth.me();
                setUser(currentUser);
            } catch (e) {
                // Not logged in
            }
        };
        checkUser();
    }, []);

    const navItems = [
        { icon: Home, label: "Feed", path: "Home" },
        { icon: MapPin, label: "Map", path: "Map" },
        { icon: PlusCircle, label: "Sell", path: "CreateListing", highlight: true },
        { icon: MessageCircle, label: "Chat", path: "Messages" },
        { icon: User, label: "Profile", path: "Profile" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-900">
            {/* Desktop Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm hidden md:block">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to={createPageUrl('Home')} className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-indigo-500/30 transition-all">
                                H
                            </div>
                            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">HyperLocal</span>
                        </Link>
                        
                        <nav className="flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link 
                                    key={item.label} 
                                    to={createPageUrl(item.path)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        currentPageName === item.path 
                                            ? 'bg-slate-100 text-slate-900' 
                                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    } ${item.highlight ? 'hidden' : ''}`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900">
                            <Bell className="w-5 h-5" />
                        </Button>
                        
                        <Link to={createPageUrl('CreateListing')}>
                            <Button className="rounded-full bg-slate-900 hover:bg-slate-800 text-white px-6 shadow-lg shadow-slate-900/20 transition-all hover:scale-105 active:scale-95">
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Post Item
                            </Button>
                        </Link>
                        
                        {user ? (
                            <Link to={createPageUrl('Profile')}>
                                <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                                    {user.avatar_url ? (
                                        <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold">
                                            {user.full_name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ) : (
                            <Button variant="outline" className="rounded-full" onClick={() => base44.auth.redirectToLogin()}>
                                Sign In
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl pb-24 md:pb-12">
                {children}
            </main>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
                <div className="flex justify-around items-center h-16 px-2">
                    {navItems.map((item) => {
                        const isActive = currentPageName === item.path;
                        return (
                            <Link 
                                key={item.label} 
                                to={createPageUrl(item.path)}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                                    isActive ? 'text-indigo-600' : 'text-gray-400'
                                }`}
                            >
                                {item.highlight ? (
                                    <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-lg shadow-slate-900/30 -mt-8 border-4 border-gray-50">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                ) : (
                                    <>
                                        <item.icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                                        <span className="text-[10px] font-medium">{item.label}</span>
                                    </>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

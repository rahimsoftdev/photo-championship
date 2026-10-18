import React, { useState, useRef, useEffect } from 'react';
import { FiMoreVertical } from 'react-icons/fi';

const ArtworkDropdownMenu = ({ onEdit, onDelete, onPromote }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Outside click korle menu close hoye jabe
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition cursor-pointer"
            >
                <FiMoreVertical size={16} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-10 w-36 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20 animate-fade-in">
                    <button
                        type="button"
                        onClick={() => { setIsOpen(false); onEdit(); }}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => { setIsOpen(false); onDelete(); }}
                        className="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition border-t border-gray-100"
                    >
                        Delete
                    </button>
                    <button
                        type="button"
                        onClick={() => { setIsOpen(false); onPromote(); }}
                        className="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition border-t border-gray-100"
                    >
                        Promote
                    </button>
                </div>
            )}
        </div>
    );
};

export default ArtworkDropdownMenu;
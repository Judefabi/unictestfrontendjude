import React from "react";
import { ChevronDown, User } from "lucide-react";
import Image from "next/image";

const Header: React.FC = () => {
  return (
    <header className="fixed z-50 top-0 left-0 w-full flex items-center justify-between bg-background text-foreground px-5 py-2">
      {/* Part 1: Logo */}
      <div className="text-2xl font-bold">
        <Image
          src="https://s3-alpha-sig.figma.com/img/f293/c9e4/c7831bf651d3ce269393c36b84355c55?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=VG8clgzXAb1FEIpfP4kWCqUl-Rd2zJ7-U4tkoSyd-CimEfl3dhgA3E6tOd525yrVuwk~Nadw8XtoIOCITHpmDC1nbVHGtl6Txe~crvKoTOCQ7juWoLi0aw7tIk0Y8m2Uxzcg7hizn3g1pSMf5UbhZLUZG0n8To2E3RPEqsu25XWfOnZQgvoXf5ow8RSfYfamdcRbcxzkX3xDm7UpH4KTMX58fBFxSc2AFBm3D4YD4H5UHPItc5xJepBZ-Qbr8ffUbmivtyA~cPlF1K1Le7VBMTj4R~wKdGdJp80oJJocW3XyOXLYgXmWrrSURpTXYOunybyussBtvPLpES2NDGx91Q__"
          alt="Picture of the author"
          width={80}
          height={48}
        />
      </div>

      {/* Part 2: Navigation */}
      <nav className="first-letter:text-label-large space-x-9">
        <a href="/dashboard" className="hover:text-gray-300">
          Dashboard
        </a>
        <a href="/dashboard" className="hover:text-gray-300">
          My App
        </a>
        <a href="/dashboard" className="hover:text-gray-300">
          App Store
        </a>
      </nav>

      {/* Part 3: Profile Section */}
      <div className="flex items-center space-x-2">
        {/* Circular profile with initials */}
        <div className="w-8 h-8 flex items-center justify-center bg-[#2AABBC] rounded-[55px] text-center">
          <span className="text-white font-semibold text-label-medium">AP</span>
        </div>
        {/* Dropdown Icon */}
        <ChevronDown size={20} className="text-white" />
      </div>
    </header>
  );
};

export default Header;

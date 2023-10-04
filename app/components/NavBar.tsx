import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const navIcons = [
    {
        src:"/assets/icons/search.svg",
        alt: 'Search'
    },
     {
        src:"/assets/icons/black-heart.svg",
        alt: 'Heart'
    },
     {
        src:"/assets/icons/user.svg",
        alt: 'User'
    }
]


const NavBar = () => {

  return (
    <header className='w-full'>
        <nav className='nav'>
            <Link href='/' className='flex items-center gap-1'>
            <Image
            src="/assets/icons/logo.svg"
            width={40}
            height={40}
            alt="Logo"
            />
            <p className='nav-logo'>
                Tris<span className='text-primary'>avvy </span>
            </p>
            </Link>
            <div className='flex items-center gap-5'>
            {
                navIcons.map((icon, index) => (
                    <Image
                    key={icon.alt}
                    src={icon.src}
                    width={40}
                    height={40}
                    alt={icon.alt}
                    />
                ))
            }
            </div>
        </nav>
    </header>
  )
}

export default NavBar
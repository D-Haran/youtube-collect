import React from 'react'
import styles from './navbar.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useUser, signOutWithGoogle } from "../../context/userContext";

const Navbar = ({userDisplayName}) => {
  const router = useRouter()
  return (
    <div className={styles.container}>
        <div className={styles.left}>
          <Link href={`/`} passHref legacyBehavior>
          <a style={{textDecoration: "none", color: "white"}}>Youtube Collect</a>
        </Link>
            
        </div>
        <div className={styles.middle}>
            <div className={styles.navBarItem}>

          <Link href={`/leaderboard/`} passHref legacyBehavior>
          <a style={{textDecoration: "none", color: "white"}}>Global Leaderboard</a>
        </Link>
                
            </div>
        </div>
        <div className={styles.right}>
            <Link href={`/premium/`} passHref legacyBehavior>
            <div className={styles.getPremium}>
                
                    Get Premium
                    <Image 
                    src="/premiumLogo.png"
                    width={30}
                    height={30}
                    alt="Picture of the author"
                    /> 
                
            </div>
            </Link>
            <div className={styles.navBarItem}>
                {userDisplayName}
                <p onClick={() => {signOutWithGoogle(); router.push('/');}}>Sign Out</p>
            </div>
        </div>
    </div>
  )
}

export default Navbar
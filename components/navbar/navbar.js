import React, { useEffect, useState } from 'react'
import styles from './navbar.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useUser, signOutWithGoogle } from "../../context/userContext";
import firebaseApp from '../../firebase/clientApp'

const Navbar = ({userDisplayName}) => {
  const [isPremium, setIsPremium] = useState(false)
  const user = useUser()
  useEffect(() => {
    if (user) {
      console.log(user)
    setIsPremium(user?.user?.isPremium)
  }
  }, [user])
  
  
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
                
                    {isPremium ? "Manage" : "Get"} Premium
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
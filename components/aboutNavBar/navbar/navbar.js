import React, { useEffect, useState } from 'react'
import styles from './navbar.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import Modal from 'react-modal';

const AboutNavbar = ({userDisplayName, showBestPick, setShowBestPick}) => {
  const [isPremium, setIsPremium] = useState(false)
  const [profileReveal, setProfileReveal] = useState(false)
  const [newUserName, setNewUserName] = useState("Test User")
  const [changeLoading, setChangeLoading] = useState(false)
  const [currUserName, setCurrUserName] = useState(userDisplayName)
  const [modalIsOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <div className={styles.container}>
          <div className={styles.left}>
            <Link href={`/`} passHref legacyBehavior>
            <a style={{textDecoration: "none", color: "white"}}>Youtube Collect</a>
          </Link>
              
          </div>
                  
          <div className={styles.right}>
              
          </div>
      </div>
      
    </>
    
  )
}

export default AboutNavbar
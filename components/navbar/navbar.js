import React, { useEffect, useState } from 'react'
import styles from './navbar.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useUser, signOutWithGoogle } from "../../context/userContext";
import firebaseApp from '../../firebase/clientApp'
import Modal from 'react-modal';

const Navbar = ({userDisplayName}) => {
  const [isPremium, setIsPremium] = useState(false)
  const [profileReveal, setProfileReveal] = useState(false)
  const [newUserName, setNewUserName] = useState("Test User")
  const [changeLoading, setChangeLoading] = useState(false)
  const user = useUser()
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (user) {
    setIsPremium(user?.user?.isPremium)
  }
  }, [user])
  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.744)"
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: "black",
      color: "white",
      borderRadius:"12px",
      padding: "30px"
    },
  };
  
  
  const router = useRouter()

  const handleChangeUserName = async (userName) => {
    setChangeLoading(true)
    await fetch(`/api/user/${user.user.uid}/change_user_data/route`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.user.uid, userName: userName })
  })
  .then(res => res.json())
  .then(data => {if (data.success) {console.log("Username Updated:", data); router.refresh()} else {alert("Cannot Change Name: \nThe last time you changed your username was within 30 days ago"); setChangeLoading(false)}});
  }
  return (
    <>
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
              <div className={styles.navBarItem}>

            <a style={{textDecoration: "none", color: "grey"}}>Collect Shop (Coming Soon!)</a>
                  
              </div>
          </div>
          <div className={styles.right}>
              <Link href={`/premium/`} passHref legacyBehavior>
              <div className={styles.getPremium}>
                  
                      {isPremium ? "" : "Get Premium"} 
                      <Image 
                      src="/premiumLogo.png"
                      width={30}
                      height={30}
                      alt="Premium Coins"
                      /> 
                  
              </div>
              </Link>
              <div className={styles.navBarItem}>
                <Image 
                  onMouseEnter={() => setProfileReveal(true)}
                  onMouseLeave={() => setProfileReveal(false)} 
                  onClick={openModal}
                  className={styles.profileLogo}
                      src="/Profile.png"
                      width={30}
                      height={30}
                      alt="Profile"
                      /> 
                  {profileReveal && <p className={styles.profileName}>{userDisplayName}</p>}
                  <p className={styles.signOutButton}  onClick={() => {signOutWithGoogle(); router.push('/');}}>
                  <Image 
                      src="/SignOut.png"
                      width={30}
                      height={30}
                      alt="Sign Out"
                      /> 
                  </p>
              </div>
          </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Profile Modal"
      >
        <h2>Username: {userDisplayName}</h2>
        <form >
          Change Username: <input maxLength={15} placeholder={userDisplayName} onChange={(e) => {setNewUserName(e.target.value)}}/>
          <button disabled={changeLoading} type='submit' onClick={(e) => {e.preventDefault(); handleChangeUserName(newUserName)}}>Submit</button>
        </form>
        
      </Modal>
    </>
    
  )
}

export default Navbar
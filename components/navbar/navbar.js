import React, { useEffect, useState } from 'react'
import styles from './navbar.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useUser, signOutWithGoogle } from "../../context/userContext";
import firebaseApp from '../../firebase/clientApp'
import Modal from 'react-modal';

const Navbar = ({userDisplayName, showBestPick, setShowBestPick}) => {
  const [isPremium, setIsPremium] = useState(false)
  const [profileReveal, setProfileReveal] = useState(false)
  const [newUserName, setNewUserName] = useState("Test User")
  const [changeLoading, setChangeLoading] = useState(false)
  const [currUserName, setCurrUserName] = useState(userDisplayName)
  const user = useUser()
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  async function changeShowBestPick(showBestPick) {
    await fetch(`/api/user/${user?.user?.uid}/best_pick_show/route`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user?.user?.uid, show: showBestPick})
    })
  }

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
  useEffect(() => {
    const userName_localStorage = localStorage.getItem("userName")
    setCurrUserName(userName_localStorage)
  }, [user, userDisplayName])
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
  const pathname = usePathname()
  useEffect(() => {
    console.log(pathname)
  }, [])

  const handleChangeUserName = async (userName) => {
    setChangeLoading(true)
    await fetch(`/api/user/${user.user.uid}/change_user_data/route`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.user.uid, userName: userName })
  })
  .then(res => res.json())
  .then(data => {if (data.success) {console.log("Username Updated:", data); router.refresh()} else {
    console.log(data)
    if (data.diffDays != null) {
      alert("Cannot Change Name: \n"+`You can change your username in ${Math.abs(data.diffDays - 30)} days`);
    } else {
      alert("Cannot Change Name: \n"+`The last time you changed your username was within 30 days ago`);
    }
    setChangeLoading(false)
  }});
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
                  onClick={pathname == "/" ? openModal : () => {}}
                  className={styles.profileLogo}
                      src="/Profile.png"
                      width={30}
                      height={30}
                      alt="Profile"
                      /> 
                  {profileReveal && <p className={styles.profileName}>{currUserName}</p>}
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
        <p>You can change your name <b>once</b> every <b>30</b> days.</p>
        <form >
          Change Username: <input maxLength={15} placeholder={userDisplayName} onChange={(e) => {setNewUserName(e.target.value)}}/>
          <button disabled={changeLoading} type='submit' onClick={(e) => {e.preventDefault(); handleChangeUserName(newUserName)}}>Submit</button>
        </form>
        { (showBestPick == true || showBestPick == false) &&
          <div className={styles.bestPickCheck}>
          <input type="checkbox" id="my-toggle" checked={showBestPick}  onClick={() => {changeShowBestPick(!showBestPick); setShowBestPick(!showBestPick)}} />
        <label for="my-toggle">Show Best Pick on Leaderboard</label>
        </div>
        }
        
      </Modal>
    </>
    
  )
}

export default Navbar
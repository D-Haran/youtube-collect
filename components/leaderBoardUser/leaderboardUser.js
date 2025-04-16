import React, { Fragment, useState } from 'react'
import styles from './leaderboardUser.module.css'
import Image from 'next/image'

const LeaderboardUser = ({user, index, me}) => {
    const [expanded, setExpanded] = useState(false)
  return (
    <div className={styles.container}>
        <div className={styles.rank}>
            <h2><b>{index+1}.</b></h2>
        </div>
        
        <div className={styles.userContainer} style={me ? {backgroundImage: "linear-gradient(135deg, #edd862, #540d0d)"}: {}}>
            <div className={styles.left}>
        <h3 className={styles.userName}>
            <b>{user.userName}{me? " (me)" : ""}</b>
            {user.premium == true &&
               <Image 
                src="/premiumLogo.png"
                width={50}
                height={50}
                alt="Picture of the author"
                />  
            }
            
        </h3>
        </div>
        <div className={styles.middle}>
        <Image 
          src="/youCoinsLogo.png"
        width={40}
        height={40}
        alt="Picture of the author"
        />
            <h3 className={styles.userBalance} style={me ? {fontWeight: "600"}: {}}>{Number(Number(user.balance).toFixed(2)).toLocaleString()} </h3>
        </div>
        <div className={styles.right}>
            <h2 className={styles.bestPickHeader} onClick={() => {setExpanded(!expanded)}}>
                <p style={{textAlign:'left'}}>Best Pick: </p>
                {
                  user.bestPick.profit > 0 ?
                  <p style={{color: "green"}}>+{Number(Number(user.bestPick.profit).toFixed(2)).toLocaleString()}</p>
                  :
                  <>
                  <p className={styles.nothing} style={me ? {color: "black"}: {}}>nothing</p>
                  </>
                }
                </h2>
            {
                expanded &&
                <Fragment>
                  {
                user.bestPick.video_metadata ?
                <div className={styles.bestPick} onClick={() => window.open(`https://youtube.com/watch?v=${user.bestPick.video_metadata.id}`)}>
                  <img className={styles.bestPickImg} src={(user.bestPick.video_metadata.snippet.thumbnails.default.url)} />
                  <hr />
                  <br />
                <span className={styles.bestPickTitle}>{(user.bestPick.video_metadata.snippet.title)}  </span>
                </div> 
                
                :
                <p className={styles.nothing} style={me ? {color: "black"}: {}}>nothing</p>
            }  
                </Fragment>
                
            }
            
            
        </div>
        </div>
        
    </div>
  )
}

export default LeaderboardUser
import React, { Fragment, useState } from 'react'
import styles from './leaderboardUser.module.css'
import Image from 'next/image'
import {
  TrendingUp,
  TrendingDown
} from "lucide-react";

const LeaderboardUser = ({user, index, me}) => {
    const [expanded, setExpanded] = useState(false)
    console.log(user)
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
            <h3 className={styles.userBalance} style={me ? {fontWeight: "600"}: {}}>
              {Number(Number(user.balance).toFixed(2)).toLocaleString()} 
              {user.profitsFromLastInvestment > 0 ? <TrendingUp style={{color: "green"}}/> : user.profitsFromLastInvestment == 0 ? "" : <TrendingDown style={{color: "red"}}/>}
            </h3>
        </div>
        <div className={styles.right}>
            <h2 className={styles.bestPickHeader} onClick={() => {setExpanded(!expanded)}}>
                <p style={{textAlign:'left'}}>Best Pick: </p>
                {
                  user.bestPick.profit ?
                  <p style={user.bestPick.profit > 0 ? {color: "green"} : user.bestPick.profit < 0 ? {color: "red"} : {color: "black"}}>
                    {user.bestPick.profit > 0 &&
                    "+"
                    }
                    {Number(Number((user.bestPick.profit/user.bestPick.investment_total_before_crash || user.bestPick.profit/user.bestPick.investment_total)*100).toFixed(2)).toLocaleString()}%</p>
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
                <>
                <div className={styles.investedAt}>
                  <p>Invested At: </p> 	&nbsp;
                  <span><b>{(user.bestPick.initial_view_count).toLocaleString()}</b> views</span>
                </div>
                {
                  user.bestPick.viewsAtSell &&
                  <div className={styles.investedAt}>
                  <p>Sold At: </p> 	&nbsp;
                  <span><b>{(user.bestPick.viewsAtSell).toLocaleString()}</b> views</span>
                </div>
                }
                
                </>
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
import React from "react";
import styles from "./footer.module.css";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logoGroup}>
          <Image 
          src="/youCoinsLogo.png"
        width={60}
        height={60}
        alt="Picture of the author"
        />
            <span className={styles.brand}>Youtube Collect</span>
          </div>

          <div className={styles.links}>
            <a href="mailto:ytcollectgame@gmail.com" className={styles.link}>Contact Me</a>
          </div>

          <div className={styles.copyright}>
            &copy; {new Date().getFullYear()} Youtube Collect
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

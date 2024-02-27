
import styles from "./MultichainMemecoinCard.module.css";

const MultichainMemecoinCard=() => {
  return (
    <div className={styles.footer4}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <img className={styles.omnicatIcon} alt="" src="/omnicat.svg" />
          <b className={styles.link}>The First ever Multichain Memecoin</b>
        </div>
        <div className={styles.links}>
          <b className={styles.text}>Link One</b>
          <b className={styles.text}>Link Two</b>
          <b className={styles.text}>Link Three</b>
          <b className={styles.text}>Link Four</b>
          <b className={styles.text}>Link Five</b>
        </div>
        <div className={styles.socialLinks}>
          <div className={styles.vectorParent}>
            <img className={styles.vectorIcon} alt="" src="/vector.svg" />
            <img className={styles.vectorIcon} alt="" src="/subtract.svg" />
          </div>
        </div>
      </div>
      <b className={styles.link}>© All rights reserved, 2024</b>
      <div className={styles.credits}>
        <div className={styles.divider} />
        <div className={styles.row}>
          <b className={styles.text}>2023 Relume. All right reserved.</b>
          <div className={styles.row}>
            <b className={styles.link7}>Privacy Policy</b>
            <b className={styles.link7}>Terms of Service</b>
            <b className={styles.link7}>Cookies Settings</b>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultichainMemecoinCard;

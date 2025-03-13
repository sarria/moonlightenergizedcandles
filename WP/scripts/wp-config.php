<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'dbs13766441' );

/** MySQL database username */
define( 'DB_USER', 'dbu2570860' );

/** MySQL database password */
define( 'DB_PASSWORD', 'V!5@-2403-5@v!-2826' );

/** MySQL hostname */
define( 'DB_HOST', 'db5017119262.hosting-data.io' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'UzOQ%//R&AbiH=Ny<`[X-zA/N|mA;z^?_%:N^ dTP/5MiKFe~4|22n&kZ4j)p$9%' );
define( 'SECURE_AUTH_KEY',  'SyND!nz%s9];Q+%`Huk;LO,iE0~.Zo~69_Dyzx|`q6IZVD^w dm8KO}j,mHRZ]JG' );
define( 'LOGGED_IN_KEY',    'V$^t8!NIHqz<N3ki9@i(,VojgK<yFCnJBW?g53uC{J^U R.92rl^{9JXPc),8bjL' );
define( 'NONCE_KEY',        '4~>*0+ORKhpYx)(9|]j}wxI)=U_UHR>Ex@Y6@nYX]0>HsAWWr!{vSx~W24$,2az ' );
define( 'AUTH_SALT',        '$j.DeUyM^oon,:h1!>@J<Ti>FrHS04cbc4Br4G:>?9gRnK@xo^QgfZPf{`yawHI+' );
define( 'SECURE_AUTH_SALT', 'R_>UeQ]s~c5/*jfrtfe} |2Sv,lng)ZL[@.*xGUu(2/7zu+/TWD.5.[03SCYYn%5' );
define( 'LOGGED_IN_SALT',   '@e~dZ];=15=jX5o.tQahC|.f#HlS0;Kkx=(W4$ ioJ(J4>X^g2u?*w*nt_Gt7g)#' );
define( 'NONCE_SALT',       'ASlG U#ZxieC+!R=0x|!!2 |(CM`zG%3v*6wrX+wQI@0b37WsxR#Bwd6`qC2=Dsd' );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );
define( 'GRAPHQL_DEBUG', true );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';

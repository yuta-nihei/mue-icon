<?php
/**
 * Plugin Name: Mue Icons
 * Description: 日本向けアイコン(印鑑・帳票・地図記号・医療・金融)をショートコードで表示します。例: [mue_icon name="hanko" variant="duotone" size="32"]
 * Version: 0.1.0
 * License: MIT
 * Text Domain: mue-icons
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'MUE_ICONS_VERSION', '0.1.0' );

/** アイコン名 → variant 一覧、alias → 正式名 を読み込む。 */
function mue_icons_data() {
	static $data = null;
	if ( null === $data ) {
		$file = __DIR__ . '/assets/icons.json';
		$json = is_readable( $file ) ? json_decode( file_get_contents( $file ), true ) : null;
		$data = is_array( $json ) ? $json : array( 'icons' => array(), 'aliases' => array() );
	}
	return $data;
}

/** ショートコードが使われたかを記録する(使われたページだけスプライトを出力)。 */
function mue_icons_mark_used( $set = false ) {
	static $used = false;
	if ( $set ) {
		$used = true;
	}
	return $used;
}

function mue_icons_shortcode( $atts ) {
	$a    = shortcode_atts(
		array(
			'name'    => '',
			'variant' => 'line',
			'size'    => '24',
			'label'   => '',
			'class'   => '',
		),
		$atts,
		'mue_icon'
	);
	$data = mue_icons_data();
	$name = sanitize_key( $a['name'] );
	if ( isset( $data['aliases'][ $name ] ) ) {
		$name = $data['aliases'][ $name ];
	}
	if ( ! isset( $data['icons'][ $name ] ) ) {
		return '';
	}
	$variant = in_array( $a['variant'], $data['icons'][ $name ], true ) ? $a['variant'] : 'line';
	$size    = max( 8, min( 512, (int) $a['size'] ) );
	$a11y    = '' !== $a['label'] ? 'role="img" aria-label="' . esc_attr( $a['label'] ) . '"' : 'aria-hidden="true"';
	$class   = trim( 'mue-icon ' . sanitize_html_class( $a['class'] ) );

	mue_icons_mark_used( true );

	return sprintf(
		'<svg class="%s" width="%d" height="%d" %s><use href="#mue-%s-%s"></use></svg>',
		esc_attr( $class ),
		$size,
		$size,
		$a11y, // 上で esc_attr 済み。
		esc_attr( $name ),
		esc_attr( $variant )
	);
}
add_shortcode( 'mue_icon', 'mue_icons_shortcode' );

/** 使われたページのフッターにスプライトを1回だけ出力する。 */
function mue_icons_print_sprite() {
	if ( ! mue_icons_mark_used() ) {
		return;
	}
	$file = __DIR__ . '/assets/sprite.svg';
	if ( is_readable( $file ) ) {
		// プラグイン同梱のビルド済みSVGをそのまま出力する。
		echo file_get_contents( $file ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
add_action( 'wp_footer', 'mue_icons_print_sprite' );

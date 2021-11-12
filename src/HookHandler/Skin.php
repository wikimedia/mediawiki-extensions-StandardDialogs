<?php

namespace MediaWiki\Extension\StandardDialogs\HookHandler;

use MediaWiki\Hook\SkinTemplateNavigation__UniversalHook;
use MediaWiki\Permissions\PermissionManager;
use SkinTemplate;
use Title;

class Skin implements SkinTemplateNavigation__UniversalHook {

	/**
	 *
	 * @var PermissionManager
	 */
	private $permissionManager = null;

	/**
	 *
	 * @param PermissionManager $permissionManager
	 */
	public function __construct( PermissionManager $permissionManager ) {
		$this->permissionManager = $permissionManager;
	}

	/**
	 *
	 * @param SkinTemplate $sktemplate
	 * @param array &$links
	 * @return void
	 */
	public function onSkinTemplateNavigation__Universal( $sktemplate, &$links ): void {
		$user = $sktemplate->getSkin()->getUser();
		$title = $sktemplate->getSkin()->getRelevantTitle();
		if ( $title instanceof Title === false ) {
			return;
		}

		if ( $title->isContentPage() && $title->exists() ) {
			$links['actions']['copy'] = [
				"href" => '',
				"text" => $sktemplate->msg( 'standarddialogs-copy-page-legend' )->text(),
				"title" => $sktemplate->msg( 'standarddialogs-copy-page-legend' )->text(),
				'position' => 20,
			];
		}

		if ( $this->permissionManager->userHasRight( $user, 'createpage' ) ) {
			$links['actions']['new-page'] = [
				'text' => $sktemplate->msg( 'standarddialogs-create-button-new-page-text' ),
				'title' => $sktemplate->msg( 'standarddialogs-create-button-new-page-title' ),
				'href' => '',
				'class' => 'new-page'
			];
		}

		if ( $this->permissionManager->userHasRight( $user, 'createpage' ) ) {
			$links['actions']['new-subpage'] = [
				'text' => $sktemplate->msg( 'standarddialogs-create-button-new-subpage-text' ),
				'title' => $sktemplate->msg( 'standarddialogs-create-button-new-subpage-title' ),
				'href' => '',
				'class' => 'new-subpage'
			];
		}

		$sktemplate->getOutput()->addModules( 'ext.standardDialogs' );
	}
}

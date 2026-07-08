StandardDialogs = window.StandardDialogs || {};
StandardDialogs.ui = StandardDialogs.ui || {};

StandardDialogs.ui.AddSubPageItemAction = function ( cfg ) {
	cfg = Object.assign( {
		actionName: 'add-subpage',
		icon: 'add',
		label: mw.msg( 'standarddialogs-create-subpage-btn-label' ),
		invisibleLabel: true,
		classes: [ 'create-subpage-item' ]
	}, cfg || {} );

	StandardDialogs.ui.AddSubPageItemAction.parent.call( this, cfg );
};

OO.inheritClass( StandardDialogs.ui.AddSubPageItemAction,
	OOJSPlus.ui.data.NavigationTreeItemAction );

StandardDialogs.ui.AddSubPageItemAction.prototype.getTitle = function ( itemWidget ) {
	const title = itemWidget && itemWidget.buttonCfg ? itemWidget.buttonCfg.title : this.title;
	const pageName = title || itemWidget.getName();

	return mw.msg( 'standarddialogs-create-subpage-btn-title', pageName );
};

StandardDialogs.ui.AddSubPageItemAction.prototype.onAction = function ( context ) {
	mw.loader.using( [ 'ext.standardDialogs.ui.NewSubpageDialog' ] ).done( () => {
		const diag = new StandardDialogs.ui.NewSubpageDialog( {
			id: 'standarddialogs-dlg-new-subpage',
			pageName: context.pageName
		} );

		diag.on( 'actioncompleted', ( newTitle ) => {
			window.location.href = newTitle.getUrl();
		} );

		diag.show();
	} );
};

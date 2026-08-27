StandardDialogs = StandardDialogs || {};
StandardDialogs.ui = StandardDialogs.ui || {};

StandardDialogs.ui.NewSubpageDialog = function StandardDialogsUiNewSubpageDialog( config ) {
	StandardDialogs.ui.NewSubpageDialog.super.call( this, config );
};
OO.inheritClass( StandardDialogs.ui.NewSubpageDialog, StandardDialogs.ui.BaseDialog );

StandardDialogs.ui.NewSubpageDialog.static.name = 'ext-standard-dialogs-new-subpage';

StandardDialogs.ui.NewSubpageDialog.prototype.makeSetupProcessData = function () {
	const data = StandardDialogs.ui.NewSubpageDialog.super.prototype.makeSetupProcessData.call( this );
	data.title = mw.message( 'standarddialogs-new-subpage-title', this.getDialogTitlePageName() ).plain();

	return data;
};

/**
 * The name is required, so the dialog opens with an empty field and nothing to create yet.
 *
 * @param {Object} data
 * @return {OO.ui.Process}
 */
StandardDialogs.ui.NewSubpageDialog.prototype.getSetupProcess = function ( data ) {
	return StandardDialogs.ui.NewSubpageDialog.super.prototype.getSetupProcess.call( this, data )
		.next( () => {
			this.actions.setAbilities( { done: false } );
		}, this );
};

StandardDialogs.ui.NewSubpageDialog.prototype.getPrimaryActionLabel = function () {
	return mw.message( 'standarddialogs-new-subpage-btn-label' ).plain();
};

StandardDialogs.ui.NewSubpageDialog.prototype.getFormItems = function () {
	this.mainInput = this.targetTitle = new StandardDialogs.widgets.SubpageTitleWidget( {
		id: this.elementId + '-tf-target',
		$overlay: this.$overlay,
		mustExist: false,
		prefix: this.pageName + '/',
		contentPagesOnly: false,
		required: true
	} );
	this.mainInput.connect( this, {
		change: 'onTitleChange'
	} );
	this.mainFieldset = new OO.ui.FieldLayout( this.targetTitle, {
		label: mw.message( 'standarddialogs-new-subpage-label' ).plain(),
		align: 'top'
	} );

	return [
		new OO.ui.FieldsetLayout( {
			items: [
				this.mainFieldset
			]
		} )
	];
};

StandardDialogs.ui.NewSubpageDialog.prototype.makeDoneActionProcess = function () {
	this.newTitle = mw.Title.newFromText( this.pageName + '/' + this.targetTitle.getValue() );
	return new OO.ui.Process( ( () => {} ), this );
};
StandardDialogs.ui.NewSubpageDialog.prototype.getActionCompletedEventArgs = function () {
	return [ this.newTitle ];
};

StandardDialogs.ui.NewSubpageDialog.prototype.onTitleChange = function ( value ) {
	if ( this.typeTimeout ) {
		clearTimeout( this.typeTimeout );
	}
	// Whatever was checked before does not hold for the new value.
	this.actions.setAbilities( { done: false } );
	if ( !value.trim() ) {
		this.clearError();
		return;
	}
	this.typeTimeout = setTimeout( () => {
		this.validateTitleNotExist( this.pageName + '/' + value );
	}, 500 );
};

FlowRouter.route('/',{
	name: 'home',
	action(){
		BlazeLayout.render('MainLayout',{middle: 'map', main: 'HomeLayout'});
	}
});

FlowRouter.route('/users',{
	name: 'userManagement',
	action(){
		BlazeLayout.render('MainLayout',{main: 'UserManagement'});
	}
});

FlowRouter.route('/bases',{
	name: 'base',
	action(){
		BlazeLayout.render('MainLayout',{main: 'baseForm'});
	}
});
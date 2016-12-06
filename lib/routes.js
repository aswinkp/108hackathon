FlowRouter.route('/',{
	name: 'test',
	action(){
		BlazeLayout.render('MainLayout',{middle: 'map'});
	}
});

FlowRouter.route('/test',{
	name: 'home',
	action(){
		BlazeLayout.render('HomeLayout');
	}
});


YUI().use('json-parse', 'node', 'dd-constrain', 'dd-proxy', 'dd-drop', 'dd-scroll', 'drag', function(Y) {
	var serverResponseMockup0 = new Array(2);
	
	serverResponseMockup0[0] = 
		'[{"id": "e-1", "status": "true"},' + 
		 '{"id": "e-2", "status": "true"},' +
		 '{"id": "e-3", "status": "false"},' +
		 '{"id": "e-4", "status": "true"},' +
		 '{"id": "e-5", "status": "true"},' +
		 '{"id": "a-1", "status": "true"},' +
		 '{"id": "a-2", "status": "false"},' +
		 '{"id": "a-3", "status": "true"},' +
		 '{"id": "a-4", "status": "true"},' +
		 '{"id": "a-5", "status": "true"},' +
		 '{"id": "a-6", "status": "true"},' +
		 '{"id": "a-7", "status": "true"}]';
			 
	serverResponseMockup0[1] = 
		'[{"id": "e-1", "status": "false"},' + 
		 '{"id": "e-2", "status": "false"},' +
		 '{"id": "e-3", "status": "false"},' +
		 '{"id": "e-4", "status": "false"},' +
		 '{"id": "e-5", "status": "false"},' +
		 '{"id": "a-1", "status": "false"},' +
		 '{"id": "a-2", "status": "false"},' +
		 '{"id": "a-3", "status": "true"},' +
		 '{"id": "a-4", "status": "true"},' +
		 '{"id": "a-5", "status": "true"},' +
		 '{"id": "a-6", "status": "true"},' +
		 '{"id": "a-7", "status": "true"}]';
	
	var j = 0;
	
	setInterval(function() 
	{ 
		j++;
		var serverResponseMockup = serverResponseMockup0[j % 2];
		
		var data = Y.JSON.parse(serverResponseMockup);

		for (var i = 0; i < data.length; i++)
		{
			if(data[i]['status'] === true)
			{
				Y.one("[tag=" + data[i]['id'] +  "]").addClass('actionActive');
			}
			else
			{
				Y.one("[tag=" + data[i]['id'] +  "]").removeClass('actionActive');
			}
		}
		
	}, 1000);
	
    //Listen for all drop:over events
    //Y.DD.DDM._debugShim = true;

    //Listen for all drag:drag events
    Y.DD.DDM.on('drag:drag', function(e) {
        //Get the last y point
        var y = e.target.lastXY[1];
        //is it greater than the lastY var?
        if (y < lastY) {
            //We are going up
            goingUp = true;
        } else {
            //We are going down.
            goingUp = false;
        }
        //Cache for next check
        lastY = y;
        Y.DD.DDM.syncActiveShims(true);
    });
    //Listen for all drag:start events
    Y.DD.DDM.on('drag:start', function(e) {
        //Get our drag object
        var drag = e.target;
        //Set some styles here
        drag.get('node').setStyle('opacity', '1');
        drag.get('dragNode').set('innerHTML', drag.get('node').get('innerHTML'));
        drag.get('dragNode').setStyles({
            opacity: '0.5',
            borderColor: drag.get('node').getStyle('borderColor'),
            backgroundColor: drag.get('node').getStyle('backgroundColor')
        });
    });
    //Listen for a drag:end events
    Y.DD.DDM.on('drag:end', function(e) {
        var drag = e.target;
        //Put our styles back
        drag.get('node').setStyles({
            visibility: '',
            opacity: '1'
        });
    });
    //Listen for all drag:drophit events
    Y.DD.DDM.on('drag:drophit', function(e) {
        var drop = e.drop.get('node'),
            drag = e.drag.get('node');

        if (drop.hasClass("command-items")) {
            //if we are not on an li, we must have been dropped on a ul
            var lastChild = drop.get('children').slice(-1).item(0);

            var canAdd;

            if (drag.hasClass("and")) {
                if (lastChild === null) {
                    canAdd = false;
                } else if (lastChild.hasClass("event-item")) {
                    canAdd = true;
                } else {
                    canAdd = false;
                }
            } else if (drag.hasClass("event-item")) {
                if (lastChild === null) {
                    canAdd = true;
                } else if (lastChild.hasClass("action-item") || lastChild.hasClass("event-item")) {
                    canAdd = false;
                } else {
                    canAdd = true;
                }
            } else if (drag.hasClass("action-item")) {
                if (lastChild === null || lastChild.hasClass("and")) {
                    canAdd = false;
                } else {
                    canAdd = true;
                }
            } else {
                canAdd = false;
            }

            if (canAdd) {
                drop.appendChild(drag.cloneNode(true));
                e.drag.nodescroll.set('parentScroll', e.drop.get('node'));
            }
        }
    });

    //Static Vars
    var goingUp = false, lastY = 0;

    //Get the list of li's in the lists and make them draggable
    var lis = Y.all('#interface ul li');
    lis.each(function(v, k) {
        var dd = new Y.DD.Drag({
            node: v,
            target: {
                padding: '0 0 0 20'
            }
        }).plug(Y.Plugin.DDProxy, {
                moveOnEnd: false
            }).plug(Y.Plugin.DDConstrained, {
                constrain2node: '#interface'
            }).plug(Y.Plugin.DDNodeScroll, {
                node: v.get('parentNode')
            });
    });

    //Create simple targets for the 2 lists.
    var uls = Y.all('#interface ul');
    uls.each(function(v, k) {
        var tar = new Y.DD.Drop({
            node: v
        });
    });


    // the controller code
    var ddController = new Y.DD.Drag({
        node: '#inner-pad'
    }).plug(Y.Plugin.DDConstrained, {
            constrain2node: '#outter-pad'
        }
    );

    ddController.on('drag:end', function(e) {
        e.preventDefault();
    });
});

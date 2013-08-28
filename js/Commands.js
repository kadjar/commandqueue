(function() {

    Command = Class.extend({
        init: function (ctxt, method, args) {
            this.ctxt = ctxt;
            this.method = method;
            this.args = args;
        }
    })

    CommandQueue = Class.extend({
        init: function () {
            this.stack = [];
            this.running = false;
            this.onComplete = null;
        }
    });
    var CQ = CommandQueue.prototype;

    CQ.start = function(onComplete) {       

        if (onComplete) this.onComplete = onComplete;

        var cmd = this.stack.pop();
        var self = this;    
        
        this.running == false && console.group('command start');
        
        if (cmd) {
            this.running = true;
            this._runCommand(cmd).then(function() { self.start(); });
        }
        else {
            if (this.onComplete) this.onComplete();
            this.running = false;
            console.warn('commands complete');
            console.groupEnd()
        }
    }

    CQ.add = function(cmd) {
        this.stack.unshift(cmd);   
    }

    CQ._runCommand = function(cmd) {
        var deferred = new j.Deferred();

        if (cmd.args)
            cmd.args = (Object.prototype.toString.apply(cmd.args) === '[object Array]') ? cmd.args : [cmd.args];
        else 
            cmd.args = [];

        cmd.args.push(deferred.resolve);

        cmd.method.apply(cmd.context, cmd.args)

        return deferred.promise();
    }

    CQ.clear = function() {
        this.stack = [];
        this.onComplete = null;
        console.warn('commands cleared');
        this.start();
    }

})();

    // Example of how to use the command queue

    // var cq = new CommandQueue();
    // var count = 0;
    // var ctxt = this;

    // $('#add').on('click', function () {
    //     var cmd = cq.add(new Command(ctxt, log, count));

    //     count++;
    // })

    // $('#start').on('click', function() {
    //     cq.start();        
    // })

    // function log(i, complete) {       
    //     setTimeout(function() {
    //         $('#log').append($('<li></li>').text('logged item ' +i));
    //         complete();
    //     }, 2000);
    // }
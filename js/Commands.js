(function() {

    Command = Class.extend({
        init: function (ctxt, method, args) {
            this.ctxt = ctxt;
            this.method = method;
            this.args = args;
        }
    })

    CommandQueue = Class.extend({
        stack: [],
        running: false
    });
    var CQ = CommandQueue.prototype;

    CQ.start = function() {
        
        var cmd = this.stack.pop();
        var self = this;    
        
        this.running == false && console.group('command start');
        
        if (cmd) {
            this.running = true;
            this._runCommand(cmd).then(function() { self.start(); });
        }
        else {
            this.running = false;
            console.warn('commands complete');
        }
    }

    CQ.add = function(cmd) {
        this.stack.unshift(cmd);   
    }

    CQ._runCommand = function(cmd) {
        var deferred = new $.Deferred();

        cmd.args = (Object.prototype.toString.apply(cmd.args) === '[object Array]') ? cmd.args : [cmd.args];
        cmd.args.push(deferred.resolve);

        cmd.method.apply(cmd.context, cmd.args)

        return deferred.promise();
    }

})();
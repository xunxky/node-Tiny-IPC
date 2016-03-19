# node-Tiny-IPC
===============
## Description
small  and simple IPC for easy clustered Development 

when I required a simple easy direct inter process communication 
within my clustered node server, I had to realize, 
that there are no simple IPCs available 

therfore I have written a fairly simple version.  
probably it wont be very resilient and shouldnt be used after all ;)

## Usage

```js
	var CPUs = require('os').cpus().length,
		cluster = require('cluster'),
		IPC=require('tiny-ipc');


	if (cluster.isMaster ) {
		var hub = IPC.makeHub('/tmp/mysock1');
		for (var i = 0; i < CPUs; i++) { //
			cluster.fork();
		}   
	} else {
		c = IPC.getClient('/tmp/mysock1');
		c.on('message',function(o){console.log(o);});
		c.broadcastMessage (' test '+process.pid);
	}
```

## Versions

* v0.1 
* v0.2 caller id  & direct message

### Roadmap
*  web socket option
*  transport filtering
*  adding simple encryption filter
*  providing better errorhandling
*  finalizing release

## Licenses
MIT or UNLICENSE as you desire

see License Directory 

### Warranty 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


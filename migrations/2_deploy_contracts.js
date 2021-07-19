var Marethon=artifacts.require ("Marethon");
var MarethonCore=artifacts.require("MarethonCore");
var SkipListBoard=artifacts.require("SkipListBoard");

module.exports = function(deployer) {
	deployer.deploy(SkipListBoard,{gas:6000000});
	deployer.link(SkipListBoard,[Marethon,MarethonCore]);
	deployer.deploy(MarethonCore,{gas:6000000});
	deployer.link(MarethonCore,Marethon);
	deployer.deploy(Marethon,{gas:6000000});
}

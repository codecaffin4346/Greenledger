pragma solidity ^0.5.0;

contract StructStorage {

    address public owner;
    uint256 public s = 0; 
    uint256 public t = 0;

    // Roles
    mapping (address => bool) public isFarmer;
    mapping (address => bool) public isInspector;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier onlyFarmer() {
        require(isFarmer[msg.sender], "Only registered farmers can call this");
        _;
    }

    modifier onlyInspector() {
        require(isInspector[msg.sender], "Only inspectors can call this");
        _;
    }

    // Events
    event CropAdded(bytes id, bytes32 name, uint256 quantity, address indexed farmer);
    event QualityTested(bytes lotNo, bytes grade, address indexed inspector);
    event FarmerRegistered(address indexed farmer);
    event InspectorRegistered(address indexed inspector);
    event FundSent(address indexed sender, address indexed receiver, uint256 amount);

    constructor() public {
        owner = msg.sender;
    }

    // Registration (For demo, anyone can register themselves to simplify testing)
    function registerAsFarmer() public {
        require(!isFarmer[msg.sender], "Already registered");
        isFarmer[msg.sender] = true;
        emit FarmerRegistered(msg.sender);
    }

    function registerAsInspector() public {
        require(!isInspector[msg.sender], "Already registered");
        isInspector[msg.sender] = true;
        emit InspectorRegistered(msg.sender);
    }

    // Existing Data Structures
    mapping (address => uint) balances;

    struct farmer {
        bytes fid;
        bytes32 fname;
        bytes32 loc;
        bytes32 crop;
        uint256 contact;
        uint quantity;
        uint exprice;
        address wallet; // Link to actual address
    }

    struct lot {
        bytes lotno;
        bytes grade;
        uint mrp;
        bytes32 testdate;
        bytes32 expdate;
    }

    mapping (bytes => farmer) f1;
    farmer[] public fm;

    mapping (bytes => lot) l1;
    lot[] public l;

    // Functions
    function fundaddr(address addr) public {
        balances[addr] = 2000;
    }

    function sendCoin(address receiver, uint amount, address sender) public returns(bool sufficient) {
        if (balances[sender] < amount) return false;
        
        balances[sender] -= amount;
        balances[receiver] += amount;
        
        emit FundSent(sender, receiver, amount);
        return true;
    }

    function getBalance(address addr) view public returns(uint) {
        return balances[addr];
    }

    // Secure Produce Function
    function produce(bytes memory id, bytes32 name, bytes32 loc, bytes32 cr, uint256 con, uint q, uint pr) public onlyFarmer {
        StructStorage.farmer memory fnew = farmer(id, name, loc, cr, con, q, pr, msg.sender);
        f1[id] = fnew;
        fm.push(fnew);
        s++;
        
        emit CropAdded(id, cr, q, msg.sender);
    }
    
    function getproduce(bytes memory j) public view returns(bytes memory,bytes32,bytes32,bytes32,uint256,uint,uint) {
        return (f1[j].fid, f1[j].fname, f1[j].loc, f1[j].crop, f1[j].contact, f1[j].quantity, f1[j].exprice);
    }

    // Secure Quality Function
    function quality(bytes memory ll, bytes memory g, uint256 p, bytes32 tt, bytes32 e) public onlyInspector {
        StructStorage.lot memory lnew = lot(ll, g, p, tt, e);
        l1[ll] = lnew;
        l.push(lnew);
        t++;
        
        emit QualityTested(ll, g, msg.sender);
    } 

    function getquality(bytes memory k) public view returns(bytes memory,bytes memory,uint,bytes32,bytes32) {
        return(l1[k].lotno, l1[k].grade, l1[k].mrp, l1[k].testdate, l1[k].expdate);
    }
}

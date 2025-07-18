"""
MedChain Blockchain Simulator
Simulates Hyperledger Fabric blockchain operations for the MVP
"""

import hashlib
import json
import time
from datetime import datetime
from typing import Dict, List, Optional

class Block:
    """Represents a block in the blockchain"""
    
    def __init__(self, index: int, transactions: List[Dict], previous_hash: str):
        self.index = index
        self.timestamp = datetime.utcnow().isoformat()
        self.transactions = transactions
        self.previous_hash = previous_hash
        self.nonce = 0
        self.hash = self.calculate_hash()
    
    def calculate_hash(self) -> str:
        """Calculate the hash of the block"""
        block_string = json.dumps({
            "index": self.index,
            "timestamp": self.timestamp,
            "transactions": self.transactions,
            "previous_hash": self.previous_hash,
            "nonce": self.nonce
        }, sort_keys=True)
        return hashlib.sha256(block_string.encode()).hexdigest()
    
    def mine_block(self, difficulty: int = 2):
        """Mine the block with proof of work"""
        target = "0" * difficulty
        while self.hash[:difficulty] != target:
            self.nonce += 1
            self.hash = self.calculate_hash()

class MedChainBlockchain:
    """MedChain Blockchain Simulator"""
    
    def __init__(self):
        self.chain: List[Block] = []
        self.pending_transactions: List[Dict] = []
        self.mining_reward = 0  # No mining reward for supply chain
        self.difficulty = 2
        
        # Create genesis block
        self.create_genesis_block()
    
    def create_genesis_block(self):
        """Create the first block in the chain"""
        genesis_block = Block(0, [], "0")
        genesis_block.mine_block(self.difficulty)
        self.chain.append(genesis_block)
    
    def get_latest_block(self) -> Block:
        """Get the latest block in the chain"""
        return self.chain[-1]
    
    def add_transaction(self, transaction: Dict) -> str:
        """Add a transaction to pending transactions"""
        transaction_id = f"TX-{int(time.time())}-{hashlib.md5(json.dumps(transaction).encode()).hexdigest()[:8]}"
        transaction["transaction_id"] = transaction_id
        transaction["timestamp"] = datetime.utcnow().isoformat()
        
        self.pending_transactions.append(transaction)
        return transaction_id
    
    def mine_pending_transactions(self) -> str:
        """Mine all pending transactions into a new block"""
        if not self.pending_transactions:
            return None
        
        block = Block(
            len(self.chain),
            self.pending_transactions.copy(),
            self.get_latest_block().hash
        )
        
        print(f"⛏️  Mining block {block.index}...")
        block.mine_block(self.difficulty)
        
        self.chain.append(block)
        self.pending_transactions = []
        
        print(f"✅ Block {block.index} mined successfully!")
        return block.hash
    
    def create_drug_batch(self, batch_data: Dict) -> str:
        """Create a new drug batch on blockchain"""
        transaction = {
            "type": "CREATE_BATCH",
            "batch_id": batch_data["batch_id"],
            "drug_name": batch_data["drug_name"],
            "manufacturer": batch_data["manufacturer"],
            "quantity": batch_data

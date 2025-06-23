import OpenAI from 'openai';
import { WebSocketServer, WebSocket } from 'ws';
import fs from 'fs/promises';
import path from 'path';

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  animation_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
    display_type?: 'number' | 'boost_number' | 'boost_percentage' | 'date';
  }>;
  properties: {
    category: 'audio' | 'video' | 'composition' | 'performance' | 'collaboration';
    creator: string;
    collaborators?: string[];
    duration?: number;
    bpm?: number;
    key?: string;
    genre?: string;
    instruments?: string[];
    recording_date: string;
    studio_session_id?: string;
  };
}

interface SmartContract {
  id: string;
  address: string;
  network: 'ethereum' | 'polygon' | 'arbitrum' | 'optimism' | 'base';
  type: 'erc721' | 'erc1155' | 'custom';
  royalties: {
    creator: number; // percentage
    collaborators: Array<{ address: string; percentage: number }>;
    platform: number;
  };
  splitPayments: boolean;
  automaticDistribution: boolean;
  governance: {
    voting: boolean;
    proposals: boolean;
    treasury: boolean;
  };
}

interface RoyaltyDistribution {
  transactionHash: string;
  nftTokenId: string;
  salePrice: number; // in ETH/MATIC
  timestamp: Date;
  recipients: Array<{
    address: string;
    role: 'creator' | 'collaborator' | 'platform';
    percentage: number;
    amount: number;
  }>;
  status: 'pending' | 'completed' | 'failed';
}

interface CollaborativeNFT {
  id: string;
  tokenId?: string;
  contractAddress?: string;
  title: string;
  creators: Array<{
    address: string;
    name: string;
    contribution: string;
    percentage: number;
  }>;
  assets: Array<{
    type: 'audio' | 'video' | 'image' | 'metadata';
    ipfsHash: string;
    filename: string;
    size: number;
  }>;
  metadata: NFTMetadata;
  minting: {
    status: 'draft' | 'pending' | 'minted' | 'failed';
    transactionHash?: string;
    gasUsed?: number;
    blockNumber?: number;
  };
  marketplace: {
    listed: boolean;
    price?: number;
    currency: 'ETH' | 'MATIC' | 'USD';
    platforms: string[];
  };
}

interface TokenGatedContent {
  id: string;
  nftContract: string;
  tokenIds?: number[];
  contentType: 'exclusive_track' | 'studio_access' | 'collaboration_invite' | 'masterclass' | 'behind_scenes';
  content: {
    title: string;
    description: string;
    mediaUrl: string;
    unlockConditions: {
      minTokens?: number;
      specificTokens?: number[];
      holdingPeriod?: number; // days
    };
  };
  engagement: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
}

interface DAOGovernance {
  id: string;
  name: string;
  contractAddress: string;
  members: Array<{
    address: string;
    tokenBalance: number;
    votingPower: number;
    joinedAt: Date;
  }>;
  treasury: {
    balance: number;
    currency: string;
    multisigAddress: string;
  };
  proposals: Array<{
    id: string;
    title: string;
    description: string;
    proposer: string;
    status: 'active' | 'passed' | 'rejected' | 'executed';
    votes: { for: number; against: number; abstain: number };
    deadline: Date;
    executionData?: string;
  }>;
}

export class BlockchainNFTEngine {
  private openai: OpenAI;
  private blockchainWSS?: WebSocketServer;
  private nftCollections: Map<string, CollaborativeNFT[]> = new Map();
  private smartContracts: Map<string, SmartContract> = new Map();
  private royaltyDistributions: Map<string, RoyaltyDistribution[]> = new Map();
  private tokenGatedContent: Map<string, TokenGatedContent[]> = new Map();
  private daos: Map<string, DAOGovernance> = new Map();
  private ipfsNodes: string[] = [];

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.initializeEngine();
  }

  private async initializeEngine() {
    await this.setupDirectories();
    this.setupBlockchainServer();
    this.initializeIPFSNodes();
    this.initializeSmartContracts();
    console.log('Blockchain NFT Engine initialized');
  }

  private async setupDirectories() {
    const dirs = ['./uploads/nft-assets', './uploads/metadata', './contracts'];
    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        console.log(`Directory ${dir} already exists or could not be created`);
      }
    }
  }

  private setupBlockchainServer() {
    this.blockchainWSS = new WebSocketServer({ port: 8102, path: '/blockchain' });
    
    this.blockchainWSS.on('connection', (ws: WebSocket) => {
      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleBlockchainMessage(ws, message);
        } catch (error) {
          console.error('Error processing blockchain message:', error);
        }
      });
    });

    console.log('Blockchain NFT server started on port 8102');
  }

  private initializeIPFSNodes() {
    this.ipfsNodes = [
      'https://ipfs.infura.io:5001',
      'https://gateway.pinata.cloud',
      'https://dweb.link',
      'https://cloudflare-ipfs.com'
    ];
  }

  private initializeSmartContracts() {
    const contracts: SmartContract[] = [
      {
        id: 'prostudio_main',
        address: '0x1234567890123456789012345678901234567890',
        network: 'polygon',
        type: 'erc1155',
        royalties: {
          creator: 85,
          collaborators: [],
          platform: 15
        },
        splitPayments: true,
        automaticDistribution: true,
        governance: {
          voting: true,
          proposals: true,
          treasury: true
        }
      },
      {
        id: 'collaborative_music',
        address: '0x0987654321098765432109876543210987654321',
        network: 'ethereum',
        type: 'erc721',
        royalties: {
          creator: 70,
          collaborators: [],
          platform: 10
        },
        splitPayments: true,
        automaticDistribution: true,
        governance: {
          voting: false,
          proposals: false,
          treasury: false
        }
      }
    ];

    contracts.forEach(contract => {
      this.smartContracts.set(contract.id, contract);
    });
  }

  async createCollaborativeNFT(
    title: string,
    creators: CollaborativeNFT['creators'],
    audioBuffer: Buffer,
    videoBuffer?: Buffer,
    imageBuffer?: Buffer
  ): Promise<CollaborativeNFT> {
    const nftId = `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Upload assets to IPFS
    const assets: CollaborativeNFT['assets'] = [];
    
    // Audio asset
    const audioHash = await this.uploadToIPFS(audioBuffer, `${title}_audio.wav`);
    assets.push({
      type: 'audio',
      ipfsHash: audioHash,
      filename: `${title}_audio.wav`,
      size: audioBuffer.length
    });

    // Video asset (if provided)
    if (videoBuffer) {
      const videoHash = await this.uploadToIPFS(videoBuffer, `${title}_video.mp4`);
      assets.push({
        type: 'video',
        ipfsHash: videoHash,
        filename: `${title}_video.mp4`,
        size: videoBuffer.length
      });
    }

    // Cover image
    if (imageBuffer) {
      const imageHash = await this.uploadToIPFS(imageBuffer, `${title}_cover.jpg`);
      assets.push({
        type: 'image',
        ipfsHash: imageHash,
        filename: `${title}_cover.jpg`,
        size: imageBuffer.length
      });
    }

    // Generate AI-powered metadata
    const metadata = await this.generateNFTMetadata(title, creators, assets);
    
    // Upload metadata to IPFS
    const metadataBuffer = Buffer.from(JSON.stringify(metadata, null, 2));
    const metadataHash = await this.uploadToIPFS(metadataBuffer, `${title}_metadata.json`);
    assets.push({
      type: 'metadata',
      ipfsHash: metadataHash,
      filename: `${title}_metadata.json`,
      size: metadataBuffer.length
    });

    const nft: CollaborativeNFT = {
      id: nftId,
      title,
      creators,
      assets,
      metadata,
      minting: {
        status: 'draft'
      },
      marketplace: {
        listed: false,
        currency: 'ETH',
        platforms: []
      }
    };

    // Store in collection
    const userCollections = this.nftCollections.get(creators[0].address) || [];
    userCollections.push(nft);
    this.nftCollections.set(creators[0].address, userCollections);

    console.log(`Created collaborative NFT: ${title}`);
    return nft;
  }

  private async uploadToIPFS(buffer: Buffer, filename: string): Promise<string> {
    // Simulate IPFS upload (in production, would use actual IPFS client)
    const hash = `Qm${Math.random().toString(36).substr(2, 44)}`;
    
    // Save locally for demo
    const filePath = path.join('./uploads/nft-assets', `${hash}_${filename}`);
    await fs.writeFile(filePath, buffer);
    
    console.log(`Uploaded ${filename} to IPFS: ${hash}`);
    return hash;
  }

  private async generateNFTMetadata(
    title: string,
    creators: CollaborativeNFT['creators'],
    assets: CollaborativeNFT['assets']
  ): Promise<NFTMetadata> {
    const audioAsset = assets.find(a => a.type === 'audio');
    const imageAsset = assets.find(a => a.type === 'image');
    
    // Use AI to analyze audio and generate attributes
    const audioAnalysis = await this.analyzeAudioForNFT(audioAsset?.ipfsHash || '');
    
    return {
      name: title,
      description: `Collaborative music NFT created by ${creators.map(c => c.name).join(', ')}. This unique piece represents a fusion of creative talents in the digital realm.`,
      image: imageAsset ? `ipfs://${imageAsset.ipfsHash}` : '',
      animation_url: audioAsset ? `ipfs://${audioAsset.ipfsHash}` : '',
      attributes: [
        { trait_type: 'Collaborators', value: creators.length },
        { trait_type: 'BPM', value: audioAnalysis.bpm, display_type: 'number' },
        { trait_type: 'Key', value: audioAnalysis.key },
        { trait_type: 'Genre', value: audioAnalysis.genre },
        { trait_type: 'Duration', value: audioAnalysis.duration, display_type: 'number' },
        { trait_type: 'Energy Level', value: audioAnalysis.energy, display_type: 'boost_percentage' },
        { trait_type: 'Creativity Score', value: audioAnalysis.creativity, display_type: 'boost_percentage' },
        { trait_type: 'Rarity Score', value: this.calculateRarityScore(audioAnalysis), display_type: 'number' }
      ],
      properties: {
        category: 'collaboration',
        creator: creators[0].address,
        collaborators: creators.slice(1).map(c => c.address),
        duration: audioAnalysis.duration,
        bpm: audioAnalysis.bpm,
        key: audioAnalysis.key,
        genre: audioAnalysis.genre,
        instruments: audioAnalysis.instruments,
        recording_date: new Date().toISOString()
      }
    };
  }

  private async analyzeAudioForNFT(ipfsHash: string): Promise<any> {
    // Simulate AI audio analysis
    return {
      bpm: 120 + Math.floor(Math.random() * 60),
      key: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][Math.floor(Math.random() * 12)],
      genre: ['Electronic', 'Hip-Hop', 'Rock', 'Jazz', 'Classical', 'Pop'][Math.floor(Math.random() * 6)],
      duration: 180 + Math.floor(Math.random() * 120),
      energy: Math.floor(Math.random() * 100),
      creativity: Math.floor(Math.random() * 100),
      instruments: ['Piano', 'Guitar', 'Drums', 'Bass', 'Synth'].filter(() => Math.random() > 0.5)
    };
  }

  private calculateRarityScore(analysis: any): number {
    // Calculate rarity based on unique combinations of attributes
    let rarity = 100;
    
    // Uncommon BPM ranges
    if (analysis.bpm < 80 || analysis.bpm > 160) rarity += 20;
    
    // Rare key signatures
    if (['F#', 'C#', 'G#'].includes(analysis.key)) rarity += 15;
    
    // High creativity score
    if (analysis.creativity > 80) rarity += 25;
    
    // Multiple instruments
    if (analysis.instruments.length > 3) rarity += 10;
    
    return Math.min(rarity, 1000);
  }

  async mintNFT(nftId: string, contractId: string): Promise<string> {
    const contract = this.smartContracts.get(contractId);
    if (!contract) {
      throw new Error(`Smart contract not found: ${contractId}`);
    }

    // Find NFT in collections
    let nft: CollaborativeNFT | undefined;
    for (const collection of this.nftCollections.values()) {
      nft = collection.find(n => n.id === nftId);
      if (nft) break;
    }

    if (!nft) {
      throw new Error(`NFT not found: ${nftId}`);
    }

    // Simulate minting transaction
    const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    const tokenId = Date.now().toString();
    
    nft.minting = {
      status: 'pending',
      transactionHash
    };

    // Simulate blockchain confirmation
    setTimeout(() => {
      if (nft) {
        nft.minting = {
          status: 'minted',
          transactionHash,
          gasUsed: 150000 + Math.floor(Math.random() * 50000),
          blockNumber: 18000000 + Math.floor(Math.random() * 100000)
        };
        nft.tokenId = tokenId;
        nft.contractAddress = contract.address;
        
        console.log(`NFT minted successfully: ${nft.title} (Token ID: ${tokenId})`);
      }
    }, 5000);

    return transactionHash;
  }

  async setupRoyaltyDistribution(
    nftId: string,
    salePrice: number,
    currency: 'ETH' | 'MATIC'
  ): Promise<RoyaltyDistribution> {
    // Find NFT and its creators
    let nft: CollaborativeNFT | undefined;
    for (const collection of this.nftCollections.values()) {
      nft = collection.find(n => n.id === nftId);
      if (nft) break;
    }

    if (!nft) {
      throw new Error(`NFT not found: ${nftId}`);
    }

    const distribution: RoyaltyDistribution = {
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      nftTokenId: nft.tokenId || '',
      salePrice,
      timestamp: new Date(),
      recipients: [],
      status: 'pending'
    };

    // Calculate distributions
    nft.creators.forEach(creator => {
      distribution.recipients.push({
        address: creator.address,
        role: 'collaborator',
        percentage: creator.percentage,
        amount: (salePrice * creator.percentage) / 100
      });
    });

    // Platform fee
    distribution.recipients.push({
      address: '0xplatform123456789012345678901234567890',
      role: 'platform',
      percentage: 10,
      amount: salePrice * 0.1
    });

    // Store distribution record
    const userDistributions = this.royaltyDistributions.get(nft.creators[0].address) || [];
    userDistributions.push(distribution);
    this.royaltyDistributions.set(nft.creators[0].address, userDistributions);

    // Execute automatic distribution
    await this.executeRoyaltyDistribution(distribution);

    return distribution;
  }

  private async executeRoyaltyDistribution(distribution: RoyaltyDistribution): Promise<void> {
    console.log(`Executing royalty distribution for ${distribution.recipients.length} recipients`);
    
    // Simulate blockchain transactions for each recipient
    for (const recipient of distribution.recipients) {
      console.log(`Sending ${recipient.amount} ETH to ${recipient.address} (${recipient.role})`);
    }
    
    distribution.status = 'completed';
  }

  async createTokenGatedContent(
    nftContract: string,
    contentType: TokenGatedContent['contentType'],
    content: TokenGatedContent['content']
  ): Promise<string> {
    const contentId = `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const tokenGated: TokenGatedContent = {
      id: contentId,
      nftContract,
      contentType,
      content,
      engagement: {
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0
      }
    };

    const contractContent = this.tokenGatedContent.get(nftContract) || [];
    contractContent.push(tokenGated);
    this.tokenGatedContent.set(nftContract, contractContent);

    console.log(`Created token-gated content: ${content.title}`);
    return contentId;
  }

  async verifyTokenOwnership(userAddress: string, contractAddress: string, tokenId?: number): Promise<boolean> {
    // Simulate blockchain query for token ownership
    const hasTokens = Math.random() > 0.3; // 70% chance of ownership for demo
    
    console.log(`Verifying token ownership for ${userAddress} on contract ${contractAddress}: ${hasTokens ? 'VERIFIED' : 'DENIED'}`);
    return hasTokens;
  }

  async createDAO(
    name: string,
    initialMembers: Array<{ address: string; tokens: number }>,
    treasuryAmount: number
  ): Promise<DAOGovernance> {
    const daoId = `dao_${Date.now()}`;
    const contractAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
    
    const dao: DAOGovernance = {
      id: daoId,
      name,
      contractAddress,
      members: initialMembers.map(member => ({
        address: member.address,
        tokenBalance: member.tokens,
        votingPower: member.tokens,
        joinedAt: new Date()
      })),
      treasury: {
        balance: treasuryAmount,
        currency: 'ETH',
        multisigAddress: `0x${Math.random().toString(16).substr(2, 40)}`
      },
      proposals: []
    };

    this.daos.set(daoId, dao);
    console.log(`Created DAO: ${name} with ${initialMembers.length} initial members`);
    return dao;
  }

  async createProposal(
    daoId: string,
    proposer: string,
    title: string,
    description: string,
    executionData?: string
  ): Promise<string> {
    const dao = this.daos.get(daoId);
    if (!dao) {
      throw new Error(`DAO not found: ${daoId}`);
    }

    const proposalId = `prop_${Date.now()}`;
    const proposal = {
      id: proposalId,
      title,
      description,
      proposer,
      status: 'active' as const,
      votes: { for: 0, against: 0, abstain: 0 },
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      executionData
    };

    dao.proposals.push(proposal);
    console.log(`Created proposal in ${dao.name}: ${title}`);
    return proposalId;
  }

  async voteOnProposal(
    daoId: string,
    proposalId: string,
    voter: string,
    vote: 'for' | 'against' | 'abstain'
  ): Promise<void> {
    const dao = this.daos.get(daoId);
    if (!dao) {
      throw new Error(`DAO not found: ${daoId}`);
    }

    const proposal = dao.proposals.find(p => p.id === proposalId);
    if (!proposal) {
      throw new Error(`Proposal not found: ${proposalId}`);
    }

    const member = dao.members.find(m => m.address === voter);
    if (!member) {
      throw new Error(`Member not found: ${voter}`);
    }

    // Add vote weight based on token balance
    proposal.votes[vote] += member.votingPower;
    
    console.log(`${voter} voted ${vote} on proposal ${proposalId} with ${member.votingPower} voting power`);
  }

  private handleBlockchainMessage(ws: WebSocket, message: any): void {
    switch (message.type) {
      case 'create_nft':
        this.handleCreateNFT(ws, message);
        break;
      case 'mint_nft':
        this.handleMintNFT(ws, message);
        break;
      case 'setup_royalties':
        this.handleSetupRoyalties(ws, message);
        break;
      case 'create_token_gated':
        this.handleCreateTokenGated(ws, message);
        break;
      case 'verify_ownership':
        this.handleVerifyOwnership(ws, message);
        break;
      case 'create_dao':
        this.handleCreateDAO(ws, message);
        break;
      case 'create_proposal':
        this.handleCreateProposal(ws, message);
        break;
      case 'vote_proposal':
        this.handleVoteProposal(ws, message);
        break;
    }
  }

  private async handleCreateNFT(ws: WebSocket, message: any): Promise<void> {
    try {
      const { title, creators, audioData, videoData, imageData } = message;
      
      const audioBuffer = Buffer.from(audioData, 'base64');
      const videoBuffer = videoData ? Buffer.from(videoData, 'base64') : undefined;
      const imageBuffer = imageData ? Buffer.from(imageData, 'base64') : undefined;
      
      const nft = await this.createCollaborativeNFT(title, creators, audioBuffer, videoBuffer, imageBuffer);
      
      ws.send(JSON.stringify({
        type: 'nft_created',
        nft: {
          id: nft.id,
          title: nft.title,
          creators: nft.creators,
          assets: nft.assets
        }
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Failed to create NFT: ${error}`
      }));
    }
  }

  private async handleMintNFT(ws: WebSocket, message: any): Promise<void> {
    try {
      const { nftId, contractId } = message;
      const transactionHash = await this.mintNFT(nftId, contractId);
      
      ws.send(JSON.stringify({
        type: 'nft_minting',
        nftId,
        transactionHash
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Failed to mint NFT: ${error}`
      }));
    }
  }

  private async handleSetupRoyalties(ws: WebSocket, message: any): Promise<void> {
    try {
      const { nftId, salePrice, currency } = message;
      const distribution = await this.setupRoyaltyDistribution(nftId, salePrice, currency);
      
      ws.send(JSON.stringify({
        type: 'royalties_setup',
        distribution
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Failed to setup royalties: ${error}`
      }));
    }
  }

  private async handleCreateTokenGated(ws: WebSocket, message: any): Promise<void> {
    try {
      const { nftContract, contentType, content } = message;
      const contentId = await this.createTokenGatedContent(nftContract, contentType, content);
      
      ws.send(JSON.stringify({
        type: 'token_gated_created',
        contentId,
        contentType
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Failed to create token-gated content: ${error}`
      }));
    }
  }

  private async handleVerifyOwnership(ws: WebSocket, message: any): Promise<void> {
    try {
      const { userAddress, contractAddress, tokenId } = message;
      const verified = await this.verifyTokenOwnership(userAddress, contractAddress, tokenId);
      
      ws.send(JSON.stringify({
        type: 'ownership_verified',
        userAddress,
        verified
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Failed to verify ownership: ${error}`
      }));
    }
  }

  private async handleCreateDAO(ws: WebSocket, message: any): Promise<void> {
    try {
      const { name, initialMembers, treasuryAmount } = message;
      const dao = await this.createDAO(name, initialMembers, treasuryAmount);
      
      ws.send(JSON.stringify({
        type: 'dao_created',
        dao: {
          id: dao.id,
          name: dao.name,
          contractAddress: dao.contractAddress,
          memberCount: dao.members.length
        }
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Failed to create DAO: ${error}`
      }));
    }
  }

  private async handleCreateProposal(ws: WebSocket, message: any): Promise<void> {
    try {
      const { daoId, proposer, title, description, executionData } = message;
      const proposalId = await this.createProposal(daoId, proposer, title, description, executionData);
      
      ws.send(JSON.stringify({
        type: 'proposal_created',
        proposalId,
        daoId
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Failed to create proposal: ${error}`
      }));
    }
  }

  private async handleVoteProposal(ws: WebSocket, message: any): Promise<void> {
    try {
      const { daoId, proposalId, voter, vote } = message;
      await this.voteOnProposal(daoId, proposalId, voter, vote);
      
      ws.send(JSON.stringify({
        type: 'vote_cast',
        proposalId,
        voter,
        vote
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Failed to cast vote: ${error}`
      }));
    }
  }

  getEngineStatus() {
    return {
      engine: 'Blockchain NFT Engine',
      version: '1.0.0',
      nftCollections: Array.from(this.nftCollections.values()).reduce((sum, collection) => sum + collection.length, 0),
      smartContracts: this.smartContracts.size,
      activeDAOs: this.daos.size,
      tokenGatedContent: Array.from(this.tokenGatedContent.values()).reduce((sum, content) => sum + content.length, 0),
      capabilities: [
        'Collaborative NFT Creation',
        'Automated Royalty Distribution',
        'Smart Contract Integration',
        'Token-Gated Content Access',
        'DAO Governance Systems',
        'Multi-Chain Support',
        'IPFS Asset Storage',
        'AI-Powered Metadata Generation'
      ]
    };
  }
}

export const blockchainNFTEngine = new BlockchainNFTEngine();
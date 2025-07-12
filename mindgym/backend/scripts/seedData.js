import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Problem from '../models/Problem.js';
import connectDB from '../config/database.js';

dotenv.config();

const sampleProblems = [
  {
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    difficulty: "Easy",
    category: "Array",
    tags: ["Array", "Hash Table"],
    inputFormat: "nums = List[int], target = int",
    outputFormat: "List[int]",
    constraints: `
• 2 ≤ nums.length ≤ 10⁴
• -10⁹ ≤ nums[i] ≤ 10⁹
• -10⁹ ≤ target ≤ 10⁹
• Only one valid answer exists.`,
    samples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]"
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]"
      }
    ],
    testCases: [
      {
        input: "[2,7,11,15]\n9",
        output: "[0,1]",
        isHidden: false
      },
      {
        input: "[3,2,4]\n6",
        output: "[1,2]",
        isHidden: false
      },
      {
        input: "[3,3]\n6",
        output: "[0,1]",
        isHidden: false
      },
      {
        input: "[1,2,3,4,5]\n8",
        output: "[2,4]",
        isHidden: true
      },
      {
        input: "[15,2,7,11]\n9",
        output: "[1,2]",
        isHidden: true
      }
    ],
    starterCode: `def twoSum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    pass`,
    solution: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    hints: [
      "Try using a hash table to store the numbers you've seen.",
      "For each number, check if its complement exists in the hash table."
    ]
  },
  {
    title: "Valid Parentheses",
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    difficulty: "Easy",
    category: "String",
    tags: ["String", "Stack"],
    inputFormat: "s = str",
    outputFormat: "bool",
    constraints: `
• 1 ≤ s.length ≤ 10⁴
• s consists of parentheses only '()[]{}'.`,
    samples: [
      {
        input: 's = "()"',
        output: "true"
      },
      {
        input: 's = "()[]{}"',
        output: "true"
      },
      {
        input: 's = "(]"',
        output: "false"
      }
    ],
    testCases: [
      {
        input: "()",
        output: "true",
        isHidden: false
      },
      {
        input: "()[]{}", 
        output: "true",
        isHidden: false
      },
      {
        input: "(]",
        output: "false",
        isHidden: false
      },
      {
        input: "([)]",
        output: "false",
        isHidden: true
      },
      {
        input: "{[]}",
        output: "true",
        isHidden: true
      }
    ],
    starterCode: `def isValid(s):
    """
    :type s: str
    :rtype: bool
    """
    pass`,
    solution: `def isValid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            stack.append(char)
    
    return not stack`,
    hints: [
      "Use a stack to keep track of opening brackets.",
      "When you encounter a closing bracket, check if it matches the most recent opening bracket."
    ]
  },
  {
    title: "Longest Substring Without Repeating Characters",
    description: `Given a string s, find the length of the longest substring without repeating characters.`,
    difficulty: "Medium",
    category: "String",
    tags: ["String", "Sliding Window", "Hash Table"],
    inputFormat: "s = str",
    outputFormat: "int",
    constraints: `
• 0 ≤ s.length ≤ 5 * 10⁴
• s consists of English letters, digits, symbols and spaces.`,
    samples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        input: 's = "pwwkew"',
        output: "3",
        explanation: 'The answer is "wke", with the length of 3.'
      }
    ],
    testCases: [
      {
        input: "abcabcbb",
        output: "3",
        isHidden: false
      },
      {
        input: "bbbbb",
        output: "1",
        isHidden: false
      },
      {
        input: "pwwkew",
        output: "3",
        isHidden: false
      },
      {
        input: "",
        output: "0",
        isHidden: true
      },
      {
        input: "dvdf",
        output: "3",
        isHidden: true
      }
    ],
    starterCode: `def lengthOfLongestSubstring(s):
    """
    :type s: str
    :rtype: int
    """
    pass`,
    solution: `def lengthOfLongestSubstring(s):
    char_set = set()
    left = 0
    max_len = 0
    
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_len = max(max_len, right - left + 1)
    
    return max_len`,
    hints: [
      "Use a sliding window approach with two pointers.",
      "Keep track of characters in the current window using a set."
    ]
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Problem.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Create admin user
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
    const adminUser = new User({
      username: 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@mindgym.com',
      password: adminPassword,
      role: 'admin',
      profile: {
        firstName: 'Admin',
        lastName: 'User'
      }
    });
    
    await adminUser.save();
    console.log('Created admin user');
    
    // Create sample problems
    const problems = [];
    for (const problemData of sampleProblems) {
      const problem = new Problem({
        ...problemData,
        createdBy: adminUser._id
      });
      problems.push(problem);
    }
    
    await Problem.insertMany(problems);
    console.log(`Created ${problems.length} sample problems`);
    
    // Create sample regular user
    const userPassword = await bcrypt.hash('user123', 12);
    const sampleUser = new User({
      username: 'johndoe',
      email: 'john@example.com',
      password: userPassword,
      role: 'user',
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Passionate about algorithms and data structures'
      }
    });
    
    await sampleUser.save();
    console.log('Created sample user');
    
    console.log('Database seeding completed successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@mindgym.com / admin123');
    console.log('User: john@example.com / user123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();
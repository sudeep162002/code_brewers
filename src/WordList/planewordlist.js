var easyList = "Tally, a popular software in the field of accounting and finance, is renowned for its efficiency in managing financial data and streamlining various business processes. With its user-friendly interface and comprehensive features, Tally has become a go-to solution for businesses of all sizes. The software enables users to maintain accurate and up-to-date financial records, including sales, purchases, expenses, and inventory. Its robust reporting capabilities provide valuable insights into the financial health of the organization, aiding in informed decision-making. Additionally, Tally facilitates compliance with tax regulations, ensuring that businesses stay up-to-date with the ever-changing legal requirements"; // Your existing word lists
var medList = "Tally, the popular accounting software, offers a range of features that cater to the diverse needs of businesses and individuals alike. Through its user-friendly interface, Tally facilitates basic accounting tasks like recording transactions, generating invoices, and managing financial reports. This accessible aspect makes it a suitable choice for individuals with limited accounting knowledge. Furthermore, Tally's structured data entry system allows for efficient data input, minimizing errors and simplifying the bookkeeping process. While the software's primary functions are relatively straightforward, intermediate users may find themselves challenged by advanced features like inventory management, payroll processing, and GST (Goods and Services Tax) compliance. Exploring these capabilities requires a willingness to invest time in learning and experimenting with the software. Nevertheless, the comprehensive support resources provided by Tally, including tutorials and user forums, offer valuable assistance for users seeking to enhance their proficiency.";
var hardList = "Tally, a widely-used accounting software, is known for its versatility and comprehensive financial management capabilities. This robust platform simplifies complex financial tasks, such as bookkeeping, invoicing, and tax management. However, mastering Tally can be challenging, requiring users to navigate through a multitude of menus, commands, and shortcuts. Users must also understand accounting principles to utilize Tally effectively, making it essential to have a solid foundation in financial concepts. Additionally, customization options and advanced features demand a steep learning curve, testing the user's adaptability and perseverance. Tally's extensive functionalities, while empowering businesses with real-time insights, demand patience and commitment from users who seek to harness its full potential. Despite the initial difficulty, dedicated users often find that Tally's efficiency and accuracy streamline financial processes, saving valuable time and resources.";

var planeWordList = "default";

function updateWordList() {
  var wordListDifficultySelect = document.getElementById('wordListDifficulty');
  const selectedDifficulty = wordListDifficultySelect.value;
  
  // Set the appropriate word list based on the selected difficulty
  switch (selectedDifficulty) {
    case 'easy':
      planeWordList = easyList;
      break;
    case 'medium':
      planeWordList = medList;
      break;
    case 'hard':
      planeWordList = hardList;
      break;
    default:
      // If the selected difficulty is not recognized, set it to the default value
      planeWordList = "default";
      break;
  }
  
  // Return an object containing the planeWordList and WordList
  return {
    
    planeWordList: planeWordList,
    WordList: planeWordList.split(" "),
  };
}

export { updateWordList };

const pug = require('pug');
const fs = require('fs');
const moment = require('moment');
let pdf = require('html-pdf');
const { listAllSettings, loadSettings } = require('@/middlewares/settings');
const { getData } = require('@/middlewares/serverData');
const useLanguage = require('@/locale/useLanguage');
const { useMoney, useDate } = require('@/settings');

const pugFiles = ['invoice', 'offer', 'quote', 'payment', 'payslip'];

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

exports.generatePdf = async (
  modelName,
  info = { filename: 'pdf_file', format: 'A4', targetLocation: '' },
  result,
  callback
) => {
  try {
    const { targetLocation } = info;

    // if PDF already exists, then delete it and create a new PDF
    if (fs.existsSync(targetLocation)) {
      fs.unlinkSync(targetLocation);
    }

    // render pdf html

    if (pugFiles.includes(modelName.toLowerCase())) {
      // Compile Pug template

      const settings = await loadSettings();
      const selectedLang = settings['tsn_app_language'];
      const translate = useLanguage({ selectedLang });

      const {
        currency_symbol,
        currency_position,
        decimal_sep,
        thousand_sep,
        cent_precision,
        zero_format,
      } = settings;

      const { moneyFormatter } = useMoney({
        settings: {
          currency_symbol,
          currency_position,
          decimal_sep,
          thousand_sep,
          cent_precision,
          zero_format,
        },
      });
      const { dateFormat } = useDate({ settings });

      settings.public_server_file = process.env.PUBLIC_SERVER_FILE;

      // Add this improved numberToWords function to your PDF controller

      const numberToWords = (num) => {
        if (num === 0) return 'Zero';

        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const teens = [
          'Ten',
          'Eleven',
          'Twelve',
          'Thirteen',
          'Fourteen',
          'Fifteen',
          'Sixteen',
          'Seventeen',
          'Eighteen',
          'Nineteen',
        ];
        const tens = [
          '',
          '',
          'Twenty',
          'Thirty',
          'Forty',
          'Fifty',
          'Sixty',
          'Seventy',
          'Eighty',
          'Ninety',
        ];

        const convertHundreds = (n) => {
          let result = '';

          if (n >= 100) {
            result += ones[Math.floor(n / 100)] + ' Hundred';
            n %= 100;
            if (n > 0) result += ' ';
          }

          if (n >= 20) {
            result += tens[Math.floor(n / 10)];
            n %= 10;
            if (n > 0) result += ' ' + ones[n];
          } else if (n >= 10) {
            result += teens[n - 10];
          } else if (n > 0) {
            result += ones[n];
          }

          return result;
        };

        let result = '';

        // Handle crores
        if (num >= 10000000) {
          result += convertHundreds(Math.floor(num / 10000000)) + ' Crore';
          num %= 10000000;
          if (num > 0) result += ', ';
        }

        // Handle lakhs
        if (num >= 100000) {
          result += convertHundreds(Math.floor(num / 100000)) + ' Lakh';
          num %= 100000;
          if (num > 0) result += ', ';
        }

        // Handle thousands
        if (num >= 1000) {
          result += convertHundreds(Math.floor(num / 1000)) + ' Thousand';
          num %= 1000;
          if (num > 0) result += ', ';
        }

        // Handle remaining hundreds, tens, and ones
        if (num > 0) {
          result += convertHundreds(num);
        }

        return result.trim();
      };

      const htmlContent = pug.renderFile('src/pdf/' + modelName + '.pug', {
        model: result,
        settings,
        translate,
        dateFormat,
        moneyFormatter,
        moment: moment,
        numberToWords,
      });

      pdf
        .create(htmlContent, {
          format: info.format,
          orientation: 'portrait',
          border: '10mm',
        })
        .toFile(targetLocation, function (error) {
          if (error) throw new Error(error);
          if (callback) callback();
        });
    }
  } catch (error) {
    throw new Error(error);
  }
};

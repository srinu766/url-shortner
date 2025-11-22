const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');

const router = express.Router();

// Generate random code
const generateRandomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 6;
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Validate URL
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};



const getAllLinks = async () => {
  const result = await pool.query(`SELECT * FROM links ORDER BY created_at DESC`);
  return result.rows;
};

const getLinkByCode = async (code) => {
  const result = await pool.query(`SELECT * FROM links WHERE code = $1`, [code]);
  return result.rows[0];
};

const createLink = async (code, targetUrl) => {
  const result = await pool.query(
    `INSERT INTO links (code, target_url)
     VALUES ($1, $2) RETURNING *`,
    [code, targetUrl]
  );
  return result.rows[0];
};

const deleteLink = async (code) => {
  const result = await pool.query(
    `DELETE FROM links WHERE code = $1 RETURNING *`,
    [code]
  );
  return result.rows[0];
};

const incrementClicks = async (code) => {
  await pool.query(`SELECT increment_link_clicks($1)`, [code]);
};


// Get all
router.get('/', async (req, res) => {
  try {
    const links = await getAllLinks();
    res.json(links);
  } catch (error) {
    console.log("err", error)
    res.status(500).json({ error: 'Failed to fetch links' });
  }
});

//  Create
router.post('/',
  body('targetUrl').isURL().withMessage('Please provide a valid URL'),
  body('code').optional().matches(/^[A-Za-z0-9]{6,8}$/)
    .withMessage('Code must be 6-8 alphanumeric characters'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { targetUrl, code } = req.body;

    if (!isValidUrl(targetUrl)) {
      return res.status(400).json({ error: 'Please provide a valid URL' });
    }

    try {
      const linkCode = code || generateRandomCode();
      const existing = await getLinkByCode(linkCode);
      if (existing) {
        return res.status(400).json({ error: 'Code already exists. Try another one.' });
      }

      const newLink = await createLink(linkCode, targetUrl);
      res.status(201).json(newLink);

    } catch (error) {
      res.status(500).json({ error: 'Failed to create link' });
    }
  }
);

//  Find link
router.get('/:code', async (req, res) => {
  try {
    const link = await getLinkByCode(req.params.code);
    if (!link) return res.status(404).json({ error: 'Link not found' });

    res.json(link);

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch link' });
  }
});

// DELETE
router.delete('/:code', async (req, res) => {
  try {
    const deleted = await deleteLink(req.params.code);
    if (!deleted) return res.status(404).json({ error: 'Link not found' });

    res.json({ message: 'Link deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: 'Failed to delete link' });
  }
});

// Increment click count
router.put('/:code/clicks', async (req, res) => {
  try {
    const link = await getLinkByCode(req.params.code);
    if (!link) return res.status(404).json({ error: 'Link not found' });

    await incrementClicks(req.params.code);

    res.json({ message: 'Click count incremented' });

  } catch (error) {
    res.status(500).json({ error: 'Failed to increment click count' });
  }
});

module.exports = router;

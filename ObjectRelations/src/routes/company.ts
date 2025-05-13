import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { validate } from '../utils/validate';

const prisma = new PrismaClient();
const router = Router();

// --- Zod Schemas -----------------------------------------------------------
const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
});

// --- Routes ----------------------------------------------------------------

// Create
router.post('/', validate(companySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = (req as any).validated as z.infer<typeof companySchema>;
    const company = await prisma.company.create({ data });
    res.status(201).json(company);
  } catch (err) {
    next(err);
  }
});

// Read all
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const companies = await prisma.company.findMany();
    res.json(companies);
  } catch (err) {
    next(err);
  }
});

// Read one
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const company = await prisma.company.findUnique({ where: { id } });
    if (!company) {
      return res.status(404).json({ status: 404, message: 'Company not found' });
    }
    res.json(company);
  } catch (err) {
    next(err);
  }
});

// Update
router.put('/:id', validate(companySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const data = (req as any).validated as z.infer<typeof companySchema>;
    const company = await prisma.company.update({ where: { id }, data });
    res.json(company);
  } catch (err) {
    next(err);
  }
});

// Delete
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await prisma.company.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// GET /companies/:id/tree - company with contacts and activities
router.get('/:id/tree', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        contacts: {
          include: {
            activities: true
          }
        }
      }
    });
    if (!company) {
      return res.status(404).json({ status: 404, message: 'Company not found' });
    }
    res.json(company);
  } catch (err) {
    next(err);
  }
});
export default router;